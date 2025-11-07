const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Read the library file
const libraryPath = './neo_code_ui_30_screens_v2_grouped.excalidrawlib';
const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Create previews directory
const previewsDir = './previews';
if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir);
}

console.log(`Found ${library.libraryItems.length} components in library`);

// Function to get bounding box of elements
function getBoundingBox(elements) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    elements.forEach(el => {
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + (el.width || 0));
        maxY = Math.max(maxY, el.y + (el.height || 0));
    });
    
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

// Function to render a simple preview
function renderPreview(item, index) {
    const elements = item.elements;
    const bbox = getBoundingBox(elements);
    
    // Create canvas with padding
    const padding = 20;
    const scale = 0.5; // Scale down for preview
    const width = (bbox.width + padding * 2) * scale;
    const height = (bbox.height + padding * 2) * scale;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Apply scale and translation
    ctx.scale(scale, scale);
    ctx.translate(-bbox.minX + padding, -bbox.minY + padding);
    
    // Draw elements (simplified rendering)
    elements.forEach(el => {
        ctx.save();
        
        // Set styles
        ctx.strokeStyle = el.strokeColor || '#000000';
        ctx.fillStyle = el.backgroundColor || 'transparent';
        ctx.lineWidth = el.strokeWidth || 1;
        
        if (el.type === 'rectangle') {
            if (el.backgroundColor && el.backgroundColor !== 'transparent') {
                ctx.fillRect(el.x, el.y, el.width, el.height);
            }
            ctx.strokeRect(el.x, el.y, el.width, el.height);
        } else if (el.type === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(
                el.x + el.width / 2,
                el.y + el.height / 2,
                el.width / 2,
                el.height / 2,
                0, 0, 2 * Math.PI
            );
            if (el.backgroundColor && el.backgroundColor !== 'transparent') {
                ctx.fill();
            }
            ctx.stroke();
        } else if (el.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(el.x, el.y);
            if (el.points) {
                el.points.forEach(point => {
                    ctx.lineTo(el.x + point[0], el.y + point[1]);
                });
            }
            ctx.stroke();
        }
        
        ctx.restore();
    });
    
    // Save to file
    const fileName = `${String(index + 1).padStart(2, '0')}-${item.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    const filePath = path.join(previewsDir, fileName);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Generated: ${fileName}`);
    return fileName;
}

// Generate all previews
const fileNames = [];
library.libraryItems.forEach((item, index) => {
    try {
        const fileName = renderPreview(item, index);
        fileNames.push(fileName);
    } catch (error) {
        console.error(`Error generating preview for ${item.name}:`, error.message);
    }
});

console.log(`\nGenerated ${fileNames.length} preview images in ${previewsDir}/`);
