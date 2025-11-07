const fs = require('fs');
const path = require('path');

const previewsDir = './previews';
const imageFiles = fs.readdirSync(previewsDir).sort();

const componentNames = [
    'Login Screen (Light)', 'Signup Screen (Light)', 'Home Screen (Light)', 'Catalog Screen (Light)',
    'Product Screen (Light)', 'Cart Screen (Light)', 'Checkout Screen (Light)', 'Order Success (Light)',
    'Profile Screen (Light)', 'Settings Screen (Light)', 'Notifications (Light)', 'Search Screen (Light)',
    'Order Tracking (Light)', 'Help Center (Light)', 'Wishlist Screen (Light)',
    'Login Screen (Dark)', 'Signup Screen (Dark)', 'Home Screen (Dark)', 'Catalog Screen (Dark)',
    'Product Screen (Dark)', 'Cart Screen (Dark)', 'Checkout Screen (Dark)', 'Order Success (Dark)',
    'Profile Screen (Dark)', 'Settings Screen (Dark)', 'Notifications (Dark)', 'Search Screen (Dark)',
    'Order Tracking (Dark)', 'Help Center (Dark)', 'Wishlist Screen (Dark)'
];

let previewHTML = '';
imageFiles.forEach((file, index) => {
    const name = componentNames[index] || file.replace('.png', '');
    previewHTML += `
                <div class="preview-card">
                    <h3>${name}</h3>
                    <div class="preview-image">
                        <img src="previews/${file}" alt="${name}">
                    </div>
                </div>`;
});

console.log('Preview HTML generated. Update your index.html with this content in the preview-grid section.');
console.log('\nTotal components:', imageFiles.length);

// Save to a file for easy copying
fs.writeFileSync('preview-cards.html', previewHTML);
console.log('\nSaved to preview-cards.html');
