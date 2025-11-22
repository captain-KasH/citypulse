const { execSync } = require('child_process');
const os = require('os');

console.log('Running post-install setup...');

// Install iOS pods if on macOS
if (os.platform() === 'darwin') {
  console.log('Installing iOS pods...');
  try {
    execSync('cd ios && pod install', { stdio: 'inherit' });
    console.log('iOS pods installed successfully!');
  } catch (error) {
    console.error('Failed to install iOS pods:', error.message);
  }
} else {
  console.log('Skipping iOS pod install (not on macOS)');
}

console.log('Post-install setup completed!');