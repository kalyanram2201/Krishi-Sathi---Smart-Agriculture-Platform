import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Leaf,
  Thermometer,
  Droplets,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const CropSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setIsAnalyzing(true);
    setSuggestions([]);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_type: data.soilType.toLowerCase(),
          soil_ph: Number(data.ph),
          moisture_level: data.moisture.toLowerCase(),
          season: data.season.toLowerCase(),
          previous_crop: data.previousCrop
            ? data.previousCrop.toLowerCase()
            : 'none',
        }),
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.status === 'success') {
        setSuggestions(result.predictions);
      }
    } catch (error) {
      console.error('Backend error:', error);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Crop Suggestions
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered crop recommendations based on soil conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Farm Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Soil + pH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Soil Type
                  </label>
                  <select
                    {...register('soilType', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select soil type</option>
                    <option value="Clay">Clay</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red">Red</option>
                    <option value="Laterite">Laterite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Thermometer className="mr-1 h-4 w-4" /> Soil pH
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('ph', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="6.5"
                  />
                </div>
              </div>

              {/* Moisture + Season */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Droplets className="mr-1 h-4 w-4" /> Moisture Level
                  </label>
                  <select
                    {...register('moisture', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" /> Season
                  </label>
                  <select
                    {...register('season', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              {/* Previous Crop */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Previous Crop
                </label>
                <input
                  type="text"
                  {...register('previousCrop')}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Rice, Wheat"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                {isAnalyzing ? 'Analyzing...' : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Get Crop Suggestions
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* RESULTS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-6">
              Recommended Crops
            </h2>

            {suggestions.length === 0 ? (
              <p className="text-gray-500 text-center">
                Fill the form to get suggestions
              </p>
            ) : (
              suggestions.map((crop, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-lg">
                    🌱 {crop.crop}
                  </h3>
                  <p className="text-green-700 font-medium">
                    Confidence: {(crop.confidence * 100).toFixed(1)}%
                  </p>
                  <p><b>Expected Yield:</b> {crop.expected_yield}</p>
                  <p><b>Profitability:</b> {crop.profitability}</p>
                  <p><b>Irrigation:</b> {crop.irrigation}</p>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestion;
