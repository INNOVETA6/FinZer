import { useEffect } from 'react';

// Import your images
import image1 from "../assets/images/Carousel_img1.png";
import image2 from "../assets/images/Carousel_img2.png";
import image3 from "../assets/images/Carousel_img3.png";
import image4 from "../assets/images/Carousel_img4.png";

const Carousel = () => {
    // Initialize Bootstrap carousel when component mounts
    useEffect(() => {
        // Bootstrap JavaScript is already imported, so the carousel should work automatically
        // You can add custom initialization here if needed
    }, []);

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner rounded-2xl">
                        <div className="carousel-item active">
                            <img
                                src={image1}
                                className="d-block w-100 h-96 md:h-[500px] lg:h-[600px] object-cover"
                                alt="Financial Dashboard"
                            />
                            
                        </div>
                        <div className="carousel-item">
                            <img
                                src={image2}
                                className="d-block w-100 h-96 md:h-[500px] lg:h-[600px] object-cover"
                                alt="Investment Growth"
                            />
                            
                        </div>
                        <div className="carousel-item">
                            <img
                                src={image3}
                                className="d-block w-100 h-96 md:h-[500px] lg:h-[600px] object-cover"
                                alt="Budget Planning"
                            />
                            
                        </div>
                        <div className="carousel-item">
                            <img
                                src={image4}
                                className="d-block w-100 h-96 md:h-[500px] lg:h-[600px] object-cover"
                                alt="Financial Insights"
                            />
                            
                        </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;