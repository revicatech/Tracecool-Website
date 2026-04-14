from PIL import Image
import os

def convert_jpg_to_webp(input_path, quality=80):
    """
    Converts a JPG image to WebP format.
    
    :param input_path: Path to the source JPG file.
    :param quality: Quality of the output WebP (1-100). Higher is better quality.
    """
    try:
        # Define the output path by changing the extension
        destination = os.path.splitext(input_path)[0] + ".webp"
        
        # Open the image
        with Image.open(input_path) as img:
            # Convert and save
            img.save(destination, format="webp", quality=quality)
            
        print(f"Success! Saved to: {destination}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
convert_jpg_to_webp("C:\\Users\\HP\\Desktop\\Tracecool-Website\\src\\assets\\solution-vrf2.jpg", quality=85)