import React from 'react';

const ProductDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {}
                    <div className="bg-gray-100 rounded-[24px] aspect-square animate-pulse"></div>

                    {}
                    <div className="flex flex-col justify-center">
                        <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse mb-6"></div>
                        <div className="h-12 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="h-10 w-1/4 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
                        <div className="h-6 w-full bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-6 w-full bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-6 w-2/3 bg-gray-200 rounded-lg animate-pulse mb-8"></div>

                        <div className="flex gap-4 mb-8">
                            <div className="h-12 flex-1 bg-gray-200 rounded-apple animate-pulse"></div>
                            <div className="h-12 flex-1 bg-gray-200 rounded-apple animate-pulse"></div>
                        </div>

                        <div className="h-24 w-full bg-gray-100 rounded-apple animate-pulse"></div>
                    </div>
                </div>

                {}
                <div className="border-t border-border pt-16">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-apple animate-pulse">
                                <div className="flex justify-between mb-4">
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
