import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Assuming you have a logo image in the assets folder

export function Capture() {
    const [file, setFile] = useState(null);
    const [recipe, setRecipe] = useState();
    const [status, setStatus] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Display the image preview
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setError('Please select a file.');
            return;
        }

        setLoading(true); // Set loading to true when submitting

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL+"backend/recipe"  , {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            setRecipe(data.recipe);
            setStatus(true);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false); // Set loading to false when response is received
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen relative">
            {loading && (
                <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
                </div>
            )}
            <nav className="bg-gray-800 p-4 flex items-center justify-between fixed top-0 right-0 left-0">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                    <span className="text-xl font-semibold">ReciPic</span>
                </div>
                <div>
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                </div>
            </nav>
            <div className="flex justify-center items-center h-full flex-col md:flex-row justify-around pt-10">
                <form onSubmit={handleSubmit} className="flex flex-col items-center mt-10">
                    {imageSrc && 
                        <img src={imageSrc} alt="Uploaded Image" className="mb-4" style={{ maxWidth: '300px' }} />
                    }
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="camera"
                        onChange={handleFileChange} 
                        alt="Upload Image" 
                        className="mb-4"
                    />
                    {error && <div className="text-red-500">{error}</div>}
                    <button 
                        type="submit"
                        disabled={loading} // Disable button while loading
                        className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Loading...' : 'Submit'} {/* Show loading text if loading */}
                    </button>
                </form>

                {/* Render the output below the submit button in mobile devices */}
                {(status && recipe) && (
                    <div className="mt-4 md:hidden p-4">
                        <div className="text-xl font-semibold">Recipe:</div>
                        <div dangerouslySetInnerHTML={{ __html: recipe }} />
                    </div>
                )}
                
                {/* Render the output beside the input in larger screens (web) */}
                {(status && recipe) && (
                    <div className="mt-4 hidden md:block w-1/2 p-2">
                        <div className="text-xl font-semibold">Recipe:</div>
                        <div dangerouslySetInnerHTML={{ __html: recipe }} />
                    </div>
                )}
            </div>
        </div>
    );
}
