import React, { useEffect, useState } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import axios from 'axios';

const FoodDisplay = ({ category }) => {
    const [list, setList] = useState([]);
    const [images, setImages] = useState({}); // Initialize as empty object

    const fetchList = async () => {
        try {
            const response = await axios.get("http://localhost:8080/fetchAll");
            if (response.data.statusCode === 200) {
                setList(response.data.data);
            } else {
                console.error("Error fetching data:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchImage = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/fetchImage/${id}`);
            const blob = await res.blob();
            const imageURL = URL.createObjectURL(blob);
            setImages(prev => ({ ...prev, [id]: imageURL }));
        } catch (err) {
            console.error("Error fetching image for ID", id, err);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        if (list.length > 0) {
            list.forEach(item => fetchImage(item.id));
        }
    }, [list]);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top Foods</h2>
            <div className="food-display-list">
                {list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                description={item.description}
                                image={images[item.id] || null}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default FoodDisplay;
