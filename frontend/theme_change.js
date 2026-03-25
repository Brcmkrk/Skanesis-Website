const fs = require('fs');
let css = fs.readFileSync('src/App.css', 'utf8');

// Font replacement
css = css.replace(/Outfit/g, 'Inter');
css = css.replace(/Poppins/g, 'Inter');

// Replace dark backgrounds
css = css.replace(/background:\s*#[0-9a-fA-F]+/g, (match) => {
    if (match.includes('050505') || match.includes('050511')) return 'background: #020617';
    return match;
});

// In case background-image was set to radial gradients from previous AI theme:
css = css.replace(/background-image:[^;]+;/g, (match) => {
    if (match.includes('radial-gradient')) {
        return 'background-image: linear-gradient(135deg, #020617 0%, #0f172a 100%);';
    }
    return match;
});

// If the old one was linear-gradient for body
css = css.replace(/background:\s*linear-gradient\(135deg,\s*#0f0c29 0%,\s*#302b63 50%,\s*#24243e 100%\);/g, 'background: linear-gradient(135deg, #020617 0%, #0f172a 100%);');

// Color gradients and neon edits - Brand Title
css = css.replace(/-webkit-linear-gradient\(45deg,\s*#[0-9a-fA-F]+,\s*#[0-9a-fA-F]+\)/g, '-webkit-linear-gradient(45deg, #3b82f6, #0d9488)');

// Primary buttons and nav buttons
css = css.replace(/linear-gradient\(45deg,\s*#[0-9a-fA-F]+,\s*#[0-9a-fA-F]+\)/g, 'linear-gradient(45deg, #2563eb, #3b82f6)');

// Box shadows with purple/cyan
css = css.replace(/rgba\(112, 0, 255, ([0-9.]+)\)/g, 'rgba(37, 99, 235, $1)');
css = css.replace(/rgba\(0, 212, 255, ([0-9.]+)\)/g, 'rgba(13, 148, 136, $1)');
css = css.replace(/rgba\(0, 198, 255, ([0-9.]+)\)/g, 'rgba(37, 99, 235, $1)');
css = css.replace(/rgba\(0, 114, 255, ([0-9.]+)\)/g, 'rgba(37, 99, 235, $1)');

// Border colors
css = css.replace(/border-color:\s*#[0-9a-fA-F]+/g, (match) => {
    if (match.includes('7000ff') || match.includes('00c6ff')) return 'border-color: #3b82f6';
    return match;
});
css = css.replace(/color:\s*#[0-9a-fA-F]+/g, (match) => {
    if (match.includes('00d4ff') || match.includes('00c6ff')) return 'color: #3b82f6';
    return match;
});

// Ambient glows adjustments
css = css.replace(/radial-gradient\(circle, rgba\(37, 99, 235, 0.15\)/g, 'radial-gradient(circle, rgba(37, 99, 235, 0.08)');
css = css.replace(/radial-gradient\(circle, rgba\(13, 148, 136, 0.12\)/g, 'radial-gradient(circle, rgba(13, 148, 136, 0.05)');

fs.writeFileSync('src/App.css', css, 'utf8');
console.log('App.css updated for Enterprise Tech Theme.');
