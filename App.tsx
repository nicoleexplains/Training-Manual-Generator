
import React, { useState, useCallback } from 'react';
import { generateDiagram } from './services/geminiService';
import { DownloadIcon, ImageIcon, SparklesIcon } from './components/Icons';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const base64Image = await generateDiagram(prompt);
      const fullImageUrl = `data:image/jpeg;base64,${base64Image}`;
      setImageUrl(fullImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleDownloadImage = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    // Create a filename from the prompt
    const filename = prompt.trim().toLowerCase().slice(0, 30).replace(/\s+/g, '_') || 'generated_artwork';
    link.download = `${filename}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Training Manual Illustrator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Describe the diagram or artwork you need, and AI will create it for you.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl flex flex-col">
            <label htmlFor="prompt" className="text-xl font-semibold text-gray-200 mb-3">
              Describe your visual
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A clean line art diagram of the water cycle with labels for evaporation, condensation, and precipitation."
              className="w-full flex-grow p-4 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 min-h-[200px] sm:min-h-[300px] resize-none"
            />
            {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateImage}
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
              {imageUrl && (
                <button
                  onClick={handleDownloadImage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download
                </button>
              )}
            </div>
          </div>

          {/* Image Display */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl flex items-center justify-center min-h-[400px] lg:min-h-full aspect-w-16 aspect-h-9 lg:aspect-none">
            {isLoading ? (
              <div className="flex flex-col items-center text-gray-400">
                <Spinner size="lg" />
                <p className="mt-4 text-lg">Creating your masterpiece...</p>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={prompt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon className="w-24 h-24 mx-auto" />
                <p className="mt-4 text-lg">Your generated image will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
