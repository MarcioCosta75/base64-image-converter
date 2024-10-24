let imgElement; // Variable to store the generated image

// Function to validate Base64 string
function isValidBase64(base64String) {
    const regex = /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/]+={0,2}$/;
    return regex.test(base64String);
}

// Function to convert Base64 to image
function convertBase64ToImage() {
    const base64String = document.getElementById('base64Input').value.trim();

    if (base64String === '') {
        alert('Please enter a Base64 string.');
        return;
    }

    // Ensure string has the required header, or validate it
    let base64Data = base64String.startsWith('data:image/') 
        ? base64String 
        : 'data:image/png;base64,' + base64String;

    if (!isValidBase64(base64Data)) {
        alert('Invalid Base64 string or format. Please use a valid image format.');
        return;
    }

    // Create the image element
    imgElement = document.createElement('img');
    imgElement.src = base64Data;

    // Clear the previous result and display the new image
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous content
    resultDiv.appendChild(imgElement);

    // Show the download button
    document.getElementById('downloadButton').style.display = 'block';
    
    // Update the preview for the current scale
    updatePreview();
}

// Function to update the image preview based on the scale input
function updatePreview() {
    const scale = parseFloat(document.getElementById('scaleInput').value); 
    const resultDiv = document.getElementById('result');

    // Re-scale the image in the canvas for preview
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.width * scale;
    canvas.height = imgElement.height * scale;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Update the preview in the result div
    resultDiv.innerHTML = ''; // Clear previous content
    const previewImage = document.createElement('img');
    previewImage.src = canvas.toDataURL();
    resultDiv.appendChild(previewImage);
}

// Function to download the scaled image
function downloadImage() {
    const format = document.getElementById('formatSelect').value; // Selected format (png, jpeg, webp)
    const scale = parseFloat(document.getElementById('scaleInput').value); // Get the user-defined scale

    // Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas width and height according to the scale
    canvas.width = imgElement.width * scale;
    canvas.height = imgElement.height * scale;

    // Draw the scaled image on the canvas
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Generate the image URL in the selected format
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL(`image/${format}`);
    downloadLink.download = `image.${format}`;

    // Trigger the download
    downloadLink.click();
}

// Add event listener to scale input for live preview
document.getElementById('scaleInput').addEventListener('input', updatePreview);
