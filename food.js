'use strict';

(function () {
  // ---- Indian Food Database (per 100g) ----
  // Sources: IFCT 2017 (National Institute of Nutrition, Hyderabad), USDA FoodData Central
  var FOOD_DB = [
    { name: 'White rice (cooked)', kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4 },
    { name: 'Brown rice (cooked)', kcal: 123, protein: 2.7, carbs: 25.8, fat: 1.0, fiber: 1.6 },
    { name: 'Basmati rice (cooked)', kcal: 121, protein: 2.5, carbs: 26.3, fat: 0.3, fiber: 0.4 },
    { name: 'Wheat roti/Chapati', kcal: 297, protein: 11.8, carbs: 52.2, fat: 4.1, fiber: 6.0 },
    { name: 'Naan (plain)', kcal: 310, protein: 10.0, carbs: 50.0, fat: 8.0, fiber: 3.0 },
    { name: 'Paratha (plain)', kcal: 320, protein: 8.0, carbs: 45.0, fat: 13.0, fiber: 3.0 },
    { name: 'Puri', kcal: 360, protein: 8.0, carbs: 50.0, fat: 16.0, fiber: 3.0 },
    { name: 'Bread (white)', kcal: 265, protein: 9.0, carbs: 49.0, fat: 3.2, fiber: 2.7 },
    { name: 'Bread (whole wheat)', kcal: 247, protein: 13.0, carbs: 41.0, fat: 3.4, fiber: 7.0 },
    { name: 'Oats (cooked)', kcal: 68, protein: 2.5, carbs: 12.0, fat: 1.4, fiber: 1.7 },
    { name: 'Maida (refined flour)', kcal: 364, protein: 10.3, carbs: 76.3, fat: 1.0, fiber: 2.7 },
    { name: 'Atta (whole wheat flour)', kcal: 340, protein: 11.8, carbs: 72.0, fat: 2.5, fiber: 11.0 },
    { name: 'Biryani (chicken)', kcal: 180, protein: 12.0, carbs: 20.0, fat: 6.0, fiber: 1.0 },
    { name: 'Biryani (vegetable)', kcal: 150, protein: 4.0, carbs: 24.0, fat: 4.5, fiber: 2.0 },
    { name: 'Pulao', kcal: 140, protein: 4.0, carbs: 22.0, fat: 4.0, fiber: 1.5 },
    { name: 'Lemon rice', kcal: 160, protein: 3.5, carbs: 28.0, fat: 4.5, fiber: 1.0 },
    { name: 'Tamarind rice', kcal: 165, protein: 3.5, carbs: 29.0, fat: 4.5, fiber: 1.2 },
    { name: 'Curd rice', kcal: 115, protein: 3.0, carbs: 18.0, fat: 3.5, fiber: 0.5 },
    { name: 'Idli', kcal: 110, protein: 3.5, carbs: 22.0, fat: 0.5, fiber: 1.0 },
    { name: 'Dosa (plain)', kcal: 168, protein: 4.0, carbs: 28.0, fat: 4.5, fiber: 1.5 },
    { name: 'Masala dosa', kcal: 195, protein: 5.0, carbs: 30.0, fat: 6.5, fiber: 2.0 },
    { name: 'Uttapam', kcal: 155, protein: 5.0, carbs: 25.0, fat: 4.0, fiber: 2.0 },
    { name: 'Vada (medu)', kcal: 185, protein: 8.0, carbs: 22.0, fat: 8.0, fiber: 3.0 },
    { name: 'Upma', kcal: 130, protein: 3.5, carbs: 22.0, fat: 3.5, fiber: 1.5 },
    { name: 'Pongal (ven)', kcal: 150, protein: 5.0, carbs: 22.0, fat: 5.0, fiber: 1.0 },
    { name: 'Pongal (sweet)', kcal: 180, protein: 4.0, carbs: 28.0, fat: 6.0, fiber: 0.5 },
    { name: 'Appam', kcal: 145, protein: 3.0, carbs: 26.0, fat: 3.5, fiber: 1.0 },
    { name: 'Puttu', kcal: 155, protein: 4.0, carbs: 28.0, fat: 3.0, fiber: 2.0 },
    { name: 'Idiyappam', kcal: 140, protein: 3.0, carbs: 26.0, fat: 2.5, fiber: 1.0 },
    { name: 'Toor dal (cooked)', kcal: 116, protein: 7.5, carbs: 18.0, fat: 0.5, fiber: 4.0 },
    { name: 'Moong dal (cooked)', kcal: 104, protein: 7.0, carbs: 17.0, fat: 0.4, fiber: 3.5 },
    { name: 'Chana dal (cooked)', kcal: 120, protein: 8.0, carbs: 19.0, fat: 0.6, fiber: 5.0 },
    { name: 'Masoor dal (cooked)', kcal: 110, protein: 7.5, carbs: 18.0, fat: 0.4, fiber: 4.0 },
    { name: 'Rajma (kidney beans)', kcal: 120, protein: 8.5, carbs: 20.0, fat: 0.5, fiber: 6.0 },
    { name: 'Chole (chickpeas)', kcal: 164, protein: 8.9, carbs: 27.0, fat: 2.6, fiber: 7.6 },
    { name: 'Black eyed peas', kcal: 105, protein: 7.0, carbs: 18.0, fat: 0.5, fiber: 5.0 },
    { name: 'Sprouted moong', kcal: 81, protein: 7.5, carbs: 13.0, fat: 0.4, fiber: 3.0 },
    { name: 'Sambhar', kcal: 70, protein: 3.5, carbs: 10.0, fat: 1.5, fiber: 2.5 },
    { name: 'Rasam', kcal: 45, protein: 1.5, carbs: 6.0, fat: 1.5, fiber: 1.0 },
    { name: 'Aloo gobi', kcal: 125, protein: 3.0, carbs: 15.0, fat: 6.0, fiber: 3.0 },
    { name: 'Bhindi (okra)', kcal: 95, protein: 2.0, carbs: 12.0, fat: 4.5, fiber: 3.0 },
    { name: 'Palak (spinach)', kcal: 60, protein: 3.0, carbs: 6.0, fat: 2.5, fiber: 2.5 },
    { name: 'Cabbage poriyal', kcal: 65, protein: 2.0, carbs: 8.0, fat: 2.5, fiber: 2.0 },
    { name: 'Beans poriyal', kcal: 70, protein: 2.5, carbs: 9.0, fat: 2.5, fiber: 3.0 },
    { name: 'Carrot (cooked)', kcal: 54, protein: 1.0, carbs: 10.0, fat: 0.5, fiber: 3.0 },
    { name: 'Beetroot (cooked)', kcal: 50, protein: 1.5, carbs: 10.0, fat: 0.2, fiber: 2.0 },
    { name: 'Drumstick (cooked)', kcal: 60, protein: 2.5, carbs: 8.0, fat: 2.0, fiber: 2.5 },
    { name: 'Brinjal curry', kcal: 80, protein: 2.0, carbs: 10.0, fat: 3.5, fiber: 3.0 },
    { name: 'Capsicum (cooked)', kcal: 40, protein: 1.0, carbs: 6.0, fat: 1.5, fiber: 1.5 },
    { name: 'Bitter gourd', kcal: 20, protein: 1.0, carbs: 4.0, fat: 0.2, fiber: 2.0 },
    { name: 'Ridge gourd', kcal: 25, protein: 1.0, carbs: 5.0, fat: 0.2, fiber: 1.5 },
    { name: 'Bottle gourd', kcal: 15, protein: 0.5, carbs: 3.0, fat: 0.1, fiber: 1.0 },
    { name: 'Pumpkin', kcal: 30, protein: 1.0, carbs: 7.0, fat: 0.1, fiber: 1.5 },
    { name: 'Potato (boiled)', kcal: 87, protein: 2.0, carbs: 20.0, fat: 0.1, fiber: 1.5 },
    { name: 'Sweet potato', kcal: 90, protein: 2.0, carbs: 21.0, fat: 0.1, fiber: 3.0 },
    { name: 'Corn (cooked)', kcal: 96, protein: 3.4, carbs: 19.0, fat: 1.5, fiber: 2.4 },
    { name: 'Cucumber', kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    { name: 'Tomato', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    { name: 'Onion', kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    { name: 'Lettuce', kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
    { name: 'Broccoli', kcal: 34, protein: 2.8, carbs: 7.0, fat: 0.4, fiber: 2.6 },
    { name: 'Cauliflower', kcal: 25, protein: 1.9, carbs: 5.0, fat: 0.3, fiber: 2.0 },
    { name: 'Raw carrot', kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 },
    { name: 'Raw beetroot', kcal: 43, protein: 1.6, carbs: 9.6, fat: 0.2, fiber: 2.8 },
    { name: 'Mixed salad', kcal: 20, protein: 1.5, carbs: 3.5, fat: 0.3, fiber: 1.5 },
    { name: 'Sprouts (moong)', kcal: 31, protein: 3.0, carbs: 5.0, fat: 0.2, fiber: 1.8 },
    { name: 'Capsicum (raw)', kcal: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1 },
    { name: 'Spinach (raw)', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    { name: 'Radish', kcal: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6 },
    { name: 'Celery', kcal: 14, protein: 0.7, carbs: 3.0, fat: 0.2, fiber: 1.6 },
    { name: 'Avocado', kcal: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7 },
    { name: 'Paneer butter masala', kcal: 220, protein: 10.0, carbs: 12.0, fat: 15.0, fiber: 1.5 },
    { name: 'Palak paneer', kcal: 180, protein: 10.0, carbs: 8.0, fat: 12.0, fiber: 3.0 },
    { name: 'Chole masala', kcal: 150, protein: 7.0, carbs: 20.0, fat: 5.0, fiber: 6.0 },
    { name: 'Rajma curry', kcal: 130, protein: 7.0, carbs: 18.0, fat: 3.0, fiber: 5.0 },
    { name: 'Chicken curry', kcal: 220, protein: 18.0, carbs: 5.0, fat: 14.0, fiber: 1.0 },
    { name: 'Chicken tikka', kcal: 190, protein: 22.0, carbs: 3.0, fat: 10.0, fiber: 0.5 },
    { name: 'Mutton curry', kcal: 250, protein: 20.0, carbs: 5.0, fat: 16.0, fiber: 0.5 },
    { name: 'Fish curry', kcal: 160, protein: 18.0, carbs: 4.0, fat: 8.0, fiber: 0.5 },
    { name: 'Prawn curry', kcal: 150, protein: 16.0, carbs: 5.0, fat: 7.0, fiber: 0.5 },
    { name: 'Egg curry', kcal: 155, protein: 10.0, carbs: 5.0, fat: 11.0, fiber: 1.0 },
    { name: 'Vegetable korma', kcal: 130, protein: 3.5, carbs: 12.0, fat: 8.0, fiber: 2.5 },
    { name: 'Dal makhani', kcal: 180, protein: 8.0, carbs: 18.0, fat: 8.0, fiber: 5.0 },
    { name: 'Butter chicken', kcal: 240, protein: 18.0, carbs: 8.0, fat: 15.0, fiber: 1.0 },
    { name: 'Paneer tikka', kcal: 210, protein: 12.0, carbs: 6.0, fat: 15.0, fiber: 1.0 },
    { name: 'Malai kofta', kcal: 200, protein: 5.0, carbs: 18.0, fat: 12.0, fiber: 2.0 },
    { name: 'Aloo matar', kcal: 110, protein: 3.0, carbs: 16.0, fat: 4.0, fiber: 3.0 },
    { name: 'Jeera aloo', kcal: 130, protein: 2.5, carbs: 18.0, fat: 5.5, fiber: 2.0 },
    { name: 'Baingan bharta', kcal: 95, protein: 2.0, carbs: 10.0, fat: 5.0, fiber: 4.0 },
    { name: 'Pav bhaji', kcal: 165, protein: 4.0, carbs: 22.0, fat: 7.0, fiber: 3.0 },
    { name: 'Chana masala', kcal: 155, protein: 7.5, carbs: 20.0, fat: 5.5, fiber: 6.5 },
    { name: 'Dal fry', kcal: 125, protein: 6.0, carbs: 16.0, fat: 4.0, fiber: 3.5 },
    { name: 'Samosa (vegetable)', kcal: 260, protein: 5.0, carbs: 30.0, fat: 14.0, fiber: 3.0 },
    { name: 'Pakora (vegetable)', kcal: 220, protein: 4.0, carbs: 22.0, fat: 13.0, fiber: 2.0 },
    { name: 'Aloo tikki', kcal: 180, protein: 3.5, carbs: 24.0, fat: 8.0, fiber: 2.0 },
    { name: 'Vada pav', kcal: 280, protein: 6.0, carbs: 35.0, fat: 13.0, fiber: 2.5 },
    { name: 'Pani puri', kcal: 140, protein: 2.5, carbs: 20.0, fat: 5.5, fiber: 1.5 },
    { name: 'Bhel puri', kcal: 120, protein: 2.0, carbs: 18.0, fat: 4.5, fiber: 1.5 },
    { name: 'Sev puri', kcal: 150, protein: 3.0, carbs: 20.0, fat: 6.5, fiber: 1.5 },
    { name: 'Dahi vada', kcal: 165, protein: 6.0, carbs: 20.0, fat: 7.0, fiber: 2.0 },
    { name: 'Bonda (vegetable)', kcal: 200, protein: 4.0, carbs: 24.0, fat: 10.0, fiber: 2.0 },
    { name: 'Pesarattu', kcal: 140, protein: 7.0, carbs: 20.0, fat: 3.5, fiber: 3.0 },
    { name: 'Bajji (vegetable)', kcal: 190, protein: 3.5, carbs: 22.0, fat: 10.0, fiber: 2.0 },
    { name: 'Milk (whole)', kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    { name: 'Milk (toned)', kcal: 44, protein: 3.0, carbs: 5.0, fat: 1.5, fiber: 0 },
    { name: 'Curd/Yogurt', kcal: 98, protein: 4.3, carbs: 6.0, fat: 5.0, fiber: 0 },
    { name: 'Buttermilk', kcal: 32, protein: 2.0, carbs: 3.5, fat: 1.0, fiber: 0 },
    { name: 'Lassi (sweet)', kcal: 90, protein: 3.0, carbs: 14.0, fat: 2.5, fiber: 0 },
    { name: 'Lassi (salted)', kcal: 60, protein: 3.0, carbs: 6.0, fat: 2.0, fiber: 0 },
    { name: 'Paneer', kcal: 296, protein: 25.0, carbs: 4.0, fat: 20.0, fiber: 0 },
    { name: 'Ghee', kcal: 900, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    { name: 'Cheese (processed)', kcal: 350, protein: 20.0, carbs: 3.0, fat: 28.0, fiber: 0 },
    { name: 'Khoya', kcal: 340, protein: 18.0, carbs: 25.0, fat: 20.0, fiber: 0 },
    { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23.0, fat: 0.3, fiber: 2.6 },
    { name: 'Apple', kcal: 52, protein: 0.3, carbs: 14.0, fat: 0.2, fiber: 2.4 },
    { name: 'Orange', kcal: 47, protein: 0.9, carbs: 12.0, fat: 0.1, fiber: 2.4 },
    { name: 'Mango', kcal: 60, protein: 0.8, carbs: 15.0, fat: 0.4, fiber: 1.6 },
    { name: 'Grapes', kcal: 69, protein: 0.7, carbs: 18.0, fat: 0.2, fiber: 0.9 },
    { name: 'Papaya', kcal: 43, protein: 0.5, carbs: 11.0, fat: 0.3, fiber: 1.7 },
    { name: 'Pineapple', kcal: 50, protein: 0.5, carbs: 13.0, fat: 0.1, fiber: 1.4 },
    { name: 'Watermelon', kcal: 30, protein: 0.6, carbs: 8.0, fat: 0.2, fiber: 0.4 },
    { name: 'Guava', kcal: 68, protein: 2.6, carbs: 14.0, fat: 1.0, fiber: 5.4 },
    { name: 'Pomegranate', kcal: 83, protein: 1.7, carbs: 19.0, fat: 1.2, fiber: 4.0 },
    { name: 'Jackfruit', kcal: 95, protein: 1.7, carbs: 23.0, fat: 0.6, fiber: 1.5 },
    { name: 'Custard apple', kcal: 101, protein: 1.7, carbs: 25.0, fat: 0.3, fiber: 2.0 },
    { name: 'Sapota (chikoo)', kcal: 83, protein: 1.1, carbs: 20.0, fat: 0.1, fiber: 5.3 },
    { name: 'Jamun', kcal: 62, protein: 0.7, carbs: 15.0, fat: 0.2, fiber: 0.6 },
    { name: 'Amla', kcal: 60, protein: 0.5, carbs: 14.0, fat: 0.1, fiber: 4.3 },
    { name: 'Chicken breast (cooked)', kcal: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0 },
    { name: 'Chicken thigh (cooked)', kcal: 209, protein: 26.0, carbs: 0, fat: 10.9, fiber: 0 },
    { name: 'Mutton (cooked)', kcal: 250, protein: 25.0, carbs: 0, fat: 17.0, fiber: 0 },
    { name: 'Egg (boiled)', kcal: 155, protein: 13.0, carbs: 1.1, fat: 11.0, fiber: 0 },
    { name: 'Egg (omelette)', kcal: 154, protein: 11.0, carbs: 0.7, fat: 12.0, fiber: 0 },
    { name: 'Fish (rohu)', kcal: 120, protein: 18.0, carbs: 0, fat: 5.0, fiber: 0 },
    { name: 'Prawns', kcal: 105, protein: 20.0, carbs: 0, fat: 2.0, fiber: 0 },
    { name: 'Keema', kcal: 180, protein: 16.0, carbs: 5.0, fat: 10.0, fiber: 1.0 },
    { name: 'Gulab jamun', kcal: 320, protein: 4.0, carbs: 50.0, fat: 12.0, fiber: 0.5 },
    { name: 'Jalebi', kcal: 310, protein: 2.5, carbs: 55.0, fat: 9.0, fiber: 0.5 },
    { name: 'Rasgulla', kcal: 180, protein: 6.0, carbs: 38.0, fat: 1.5, fiber: 0 },
    { name: 'Sandesh', kcal: 210, protein: 8.0, carbs: 30.0, fat: 6.0, fiber: 0 },
    { name: 'Barfi', kcal: 320, protein: 6.0, carbs: 45.0, fat: 13.0, fiber: 0.5 },
    { name: 'Halwa (carrot)', kcal: 250, protein: 3.0, carbs: 35.0, fat: 12.0, fiber: 2.0 },
    { name: 'Halwa (sooji)', kcal: 280, protein: 4.0, carbs: 40.0, fat: 12.0, fiber: 1.5 },
    { name: 'Payasam', kcal: 180, protein: 4.0, carbs: 30.0, fat: 5.0, fiber: 0.5 },
    { name: 'Kheer', kcal: 150, protein: 4.0, carbs: 22.0, fat: 5.5, fiber: 0.5 },
    { name: 'Ladoo (besan)', kcal: 340, protein: 6.0, carbs: 50.0, fat: 14.0, fiber: 1.5 },
    { name: 'Ladoo (motichoor)', kcal: 330, protein: 4.0, carbs: 52.0, fat: 13.0, fiber: 1.0 },
    { name: 'Modak', kcal: 250, protein: 3.0, carbs: 40.0, fat: 9.0, fiber: 1.0 },
    { name: 'Mysore pak', kcal: 380, protein: 4.0, carbs: 50.0, fat: 20.0, fiber: 0.5 },
    { name: 'Shrikhand', kcal: 250, protein: 6.0, carbs: 35.0, fat: 10.0, fiber: 0 },
    { name: 'Gajar ka halwa', kcal: 240, protein: 3.0, carbs: 35.0, fat: 10.0, fiber: 2.5 },
    { name: 'Phirni', kcal: 140, protein: 3.5, carbs: 22.0, fat: 4.5, fiber: 0.5 },
    { name: 'Chai (milk tea)', kcal: 40, protein: 1.0, carbs: 6.0, fat: 1.5, fiber: 0 },
    { name: 'Coffee (with milk)', kcal: 35, protein: 0.8, carbs: 5.0, fat: 1.2, fiber: 0 },
    { name: 'Masala chai', kcal: 45, protein: 1.0, carbs: 7.0, fat: 1.5, fiber: 0 },
    { name: 'Mango lassi', kcal: 100, protein: 3.5, carbs: 16.0, fat: 2.5, fiber: 0.5 },
    { name: 'Nimbu pani (lemonade)', kcal: 40, protein: 0.2, carbs: 10.0, fat: 0, fiber: 0 },
    { name: 'Buttermilk (spiced)', kcal: 35, protein: 2.0, carbs: 4.0, fat: 1.0, fiber: 0.5 },
    { name: 'Pickle (mango)', kcal: 120, protein: 1.0, carbs: 15.0, fat: 6.0, fiber: 2.0 },
    { name: 'Chutney (mint)', kcal: 60, protein: 2.0, carbs: 8.0, fat: 2.5, fiber: 2.0 },
    { name: 'Chutney (coconut)', kcal: 120, protein: 2.5, carbs: 8.0, fat: 9.0, fiber: 3.0 },
    { name: 'Raita', kcal: 60, protein: 3.0, carbs: 5.0, fat: 3.0, fiber: 0.5 },
    { name: 'Papad', kcal: 370, protein: 25.0, carbs: 50.0, fat: 4.0, fiber: 5.0 },
    { name: 'Appalam', kcal: 365, protein: 24.0, carbs: 52.0, fat: 3.0, fiber: 4.0 },
    { name: 'Chaat', kcal: 150, protein: 3.0, carbs: 22.0, fat: 5.5, fiber: 2.0 },
    { name: 'Dahi puri', kcal: 160, protein: 5.0, carbs: 22.0, fat: 5.5, fiber: 1.5 },
    { name: 'Ragda pattice', kcal: 170, protein: 5.0, carbs: 22.0, fat: 7.0, fiber: 3.0 },
    { name: 'Misal pav', kcal: 180, protein: 7.0, carbs: 22.0, fat: 7.5, fiber: 5.0 },
    { name: 'Dhokla', kcal: 120, protein: 5.0, carbs: 18.0, fat: 3.0, fiber: 1.5 },
    { name: 'Khandvi', kcal: 130, protein: 5.0, carbs: 18.0, fat: 4.0, fiber: 1.5 },
    { name: 'Fafda', kcal: 350, protein: 10.0, carbs: 50.0, fat: 12.0, fiber: 4.0 },
    { name: 'Gathiya', kcal: 380, protein: 10.0, carbs: 55.0, fat: 13.0, fiber: 3.0 },
    { name: 'Murmura', kcal: 340, protein: 7.0, carbs: 72.0, fat: 1.0, fiber: 2.0 },
    { name: 'Chivda', kcal: 400, protein: 8.0, carbs: 55.0, fat: 17.0, fiber: 3.0 },
    { name: 'Namak pare', kcal: 380, protein: 8.0, carbs: 55.0, fat: 15.0, fiber: 2.0 },
    { name: 'Mathri', kcal: 390, protein: 8.0, carbs: 55.0, fat: 16.0, fiber: 2.5 },
    { name: 'Almonds', kcal: 579, protein: 21.0, carbs: 22.0, fat: 50.0, fiber: 12.0 },
    { name: 'Cashews', kcal: 553, protein: 18.0, carbs: 30.0, fat: 44.0, fiber: 3.3 },
    { name: 'Peanuts', kcal: 567, protein: 26.0, carbs: 16.0, fat: 49.0, fiber: 8.5 },
    { name: 'Walnuts', kcal: 654, protein: 15.0, carbs: 14.0, fat: 65.0, fiber: 6.7 },
    { name: 'Raisins', kcal: 300, protein: 3.0, carbs: 74.0, fat: 0.5, fiber: 3.7 },
    { name: 'Dates', kcal: 277, protein: 1.8, carbs: 75.0, fat: 0.2, fiber: 6.7 },
    { name: 'Figs (dried)', kcal: 249, protein: 3.3, carbs: 64.0, fat: 0.9, fiber: 9.8 },
    { name: 'Coconut (fresh)', kcal: 354, protein: 3.3, carbs: 15.0, fat: 33.0, fiber: 9.0 },
    { name: 'Sesame seeds', kcal: 573, protein: 18.0, carbs: 23.0, fat: 50.0, fiber: 12.0 },
    { name: 'Sunflower seeds', kcal: 584, protein: 21.0, carbs: 20.0, fat: 51.0, fiber: 8.6 },
    { name: 'Cooking oil', kcal: 884, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    { name: 'Mustard oil', kcal: 884, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    { name: 'Coconut oil', kcal: 862, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    { name: 'Groundnut oil', kcal: 884, protein: 0, carbs: 0, fat: 100.0, fiber: 0 },
    { name: 'Sugar', kcal: 387, protein: 0, carbs: 100.0, fat: 0, fiber: 0 },
    { name: 'Jaggery', kcal: 383, protein: 0.4, carbs: 95.0, fat: 0.1, fiber: 0 },
    { name: 'Honey', kcal: 304, protein: 0.3, carbs: 82.0, fat: 0, fiber: 0.2 },
    { name: 'Turmeric', kcal: 312, protein: 9.7, carbs: 67.0, fat: 3.3, fiber: 21.0 },
    { name: 'Cumin', kcal: 375, protein: 18.0, carbs: 44.0, fat: 22.0, fiber: 11.0 },
    { name: 'Coriander', kcal: 298, protein: 12.0, carbs: 55.0, fat: 5.0, fiber: 42.0 },
    { name: 'Chilli powder', kcal: 282, protein: 12.0, carbs: 50.0, fat: 10.0, fiber: 15.0 },
    { name: 'Garam masala', kcal: 379, protein: 10.0, carbs: 42.0, fat: 20.0, fiber: 14.0 },
    { name: 'Idli batter', kcal: 95, protein: 3.0, carbs: 18.0, fat: 0.5, fiber: 1.0 },
    { name: 'Dosa batter', kcal: 110, protein: 3.5, carbs: 20.0, fat: 1.5, fiber: 1.5 },
    { name: 'Dhokla batter', kcal: 105, protein: 4.5, carbs: 16.0, fat: 2.0, fiber: 1.0 },
    { name: 'Soya chunks', kcal: 345, protein: 52.0, carbs: 33.0, fat: 0.9, fiber: 13.0 },
    { name: 'Tofu', kcal: 76, protein: 8.0, carbs: 1.9, fat: 4.8, fiber: 0.3 },
    { name: 'Mushroom', kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0 },
    { name: 'Sweet corn', kcal: 86, protein: 3.2, carbs: 19.0, fat: 1.2, fiber: 2.7 },
    { name: 'Sprouts', kcal: 80, protein: 7.0, carbs: 12.0, fat: 0.5, fiber: 3.0 },
    { name: 'Chinese Noodles (fried)', kcal: 198, protein: 5.0, carbs: 28.0, fat: 8.0, fiber: 1.5 },
    { name: 'Hakka Noodles', kcal: 180, protein: 4.5, carbs: 26.0, fat: 7.0, fiber: 1.2 },
    { name: 'Schezwan Fried Rice', kcal: 195, protein: 4.0, carbs: 30.0, fat: 7.5, fiber: 1.5 },
    { name: 'Manchurian Gravy', kcal: 120, protein: 3.0, carbs: 14.0, fat: 6.0, fiber: 1.0 },
    { name: 'Manchurian Dry', kcal: 150, protein: 3.5, carbs: 16.0, fat: 8.0, fiber: 1.0 },
    { name: 'Chilli Chicken', kcal: 220, protein: 15.0, carbs: 10.0, fat: 14.0, fiber: 1.0 },
    { name: 'Chicken Fried Rice', kcal: 200, protein: 10.0, carbs: 25.0, fat: 8.0, fiber: 1.0 },
    { name: 'Sweet Corn Soup', kcal: 65, protein: 2.0, carbs: 10.0, fat: 2.0, fiber: 1.0 },
    { name: 'Hot and Sour Soup', kcal: 45, protein: 2.5, carbs: 6.0, fat: 1.5, fiber: 0.5 },
    { name: 'Momos (veg, 6 pcs)', kcal: 240, protein: 6.0, carbs: 32.0, fat: 9.0, fiber: 2.0 },
    { name: 'Momos (chicken, 6 pcs)', kcal: 270, protein: 12.0, carbs: 28.0, fat: 12.0, fiber: 1.5 },
    { name: 'Spring Roll (2 pcs)', kcal: 280, protein: 5.0, carbs: 30.0, fat: 16.0, fiber: 2.0 },
    { name: 'Grilled Chicken Breast', kcal: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0 },
    { name: 'Tandoori Chicken (1 pc)', kcal: 210, protein: 22.0, carbs: 4.0, fat: 12.0, fiber: 0.5 },
    { name: 'Chicken Tikka Kebab (3 pcs)', kcal: 190, protein: 20.0, carbs: 5.0, fat: 10.0, fiber: 0.5 },
    { name: 'Seekh Kebab (2 pcs)', kcal: 220, protein: 18.0, carbs: 4.0, fat: 15.0, fiber: 0.5 },
    { name: 'Shawarma (chicken)', kcal: 250, protein: 16.0, carbs: 22.0, fat: 12.0, fiber: 2.0 },
    { name: 'Shawarma (beef)', kcal: 280, protein: 18.0, carbs: 20.0, fat: 16.0, fiber: 1.5 },
    { name: 'Falafel (4 pcs)', kcal: 200, protein: 8.0, carbs: 20.0, fat: 10.0, fiber: 4.0 },
    { name: 'Hummus', kcal: 166, protein: 8.0, carbs: 14.0, fat: 10.0, fiber: 6.0 },
    { name: 'Pita Bread (1 pc)', kcal: 165, protein: 5.5, carbs: 33.0, fat: 1.0, fiber: 1.5 },
    { name: 'Gulab Jamun (2 pcs)', kcal: 175, protein: 2.0, carbs: 30.0, fat: 5.0, fiber: 0.5 },
    { name: 'Rasgulla (2 pcs)', kcal: 120, protein: 3.0, carbs: 22.0, fat: 1.0, fiber: 0 },
    { name: 'Jalebi (3 pcs)', kcal: 180, protein: 1.5, carbs: 35.0, fat: 4.0, fiber: 0 },
    { name: 'Barfi (2 pcs)', kcal: 150, protein: 2.0, carbs: 20.0, fat: 7.0, fiber: 0 },
    { name: 'Rasmalai (1 pc)', kcal: 140, protein: 5.0, carbs: 18.0, fat: 6.0, fiber: 0 },
    { name: 'Kulfi (1 pc)', kcal: 150, protein: 4.0, carbs: 20.0, fat: 7.0, fiber: 0 },
    { name: 'Chocolate Ice Cream (1 scoop)', kcal: 150, protein: 2.5, carbs: 18.0, fat: 8.0, fiber: 0.5 },
    { name: 'Butter Chicken (1 serving)', kcal: 280, protein: 20.0, carbs: 10.0, fat: 18.0, fiber: 1.0 },
    { name: 'Palak Paneer (1 serving)', kcal: 180, protein: 10.0, carbs: 8.0, fat: 12.0, fiber: 3.0 },
    { name: 'Chole Bhature (1 set)', kcal: 450, protein: 12.0, carbs: 55.0, fat: 20.0, fiber: 6.0 },
    { name: 'Pav Bhaji (1 plate)', kcal: 350, protein: 8.0, carbs: 45.0, fat: 16.0, fiber: 5.0 },
    { name: 'Vada Pav (1 pc)', kcal: 300, protein: 6.0, carbs: 38.0, fat: 14.0, fiber: 2.5 },
    { name: 'Chicken Shawarma Plate', kcal: 400, protein: 25.0, carbs: 35.0, fat: 18.0, fiber: 3.0 },
    { name: 'Chicken Shawarma Wrap', kcal: 320, protein: 18.0, carbs: 30.0, fat: 15.0, fiber: 2.5 },
    { name: 'Beef Shawarma Wrap', kcal: 350, protein: 20.0, carbs: 28.0, fat: 18.0, fiber: 2.0 },
    { name: 'Grilled Paneer Sandwich', kcal: 280, protein: 12.0, carbs: 28.0, fat: 14.0, fiber: 2.0 },
    { name: 'Chicken Grill Plate', kcal: 350, protein: 28.0, carbs: 15.0, fat: 20.0, fiber: 2.0 },
    { name: 'Veg Grill Sandwich', kcal: 250, protein: 8.0, carbs: 30.0, fat: 11.0, fiber: 3.0 },
    { name: 'Chicken Burger', kcal: 350, protein: 18.0, carbs: 32.0, fat: 18.0, fiber: 2.0 },
    { name: 'Veg Burger', kcal: 280, protein: 8.0, carbs: 35.0, fat: 12.0, fiber: 3.0 },
    { name: 'French Fries (medium)', kcal: 310, protein: 3.5, carbs: 40.0, fat: 16.0, fiber: 3.0 },
    { name: 'Cheese Fries', kcal: 380, protein: 8.0, carbs: 42.0, fat: 20.0, fiber: 2.5 },
    { name: 'Chicken Wings (4 pcs)', kcal: 280, protein: 24.0, carbs: 5.0, fat: 18.0, fiber: 0.5 },
    { name: 'Chicken 65', kcal: 250, protein: 18.0, carbs: 10.0, fat: 16.0, fiber: 0.5 },
    { name: 'Fish Fry', kcal: 200, protein: 20.0, carbs: 5.0, fat: 12.0, fiber: 0.5 },
    { name: 'Prawn Fry', kcal: 180, protein: 18.0, carbs: 6.0, fat: 10.0, fiber: 0.5 },
    { name: 'Mutton Rogan Josh (1 serving)', kcal: 250, protein: 18.0, carbs: 6.0, fat: 18.0, fiber: 1.0 },
    { name: 'Chicken Korma (1 serving)', kcal: 230, protein: 15.0, carbs: 8.0, fat: 16.0, fiber: 1.0 },
    { name: 'Bhindi Masala (1 serving)', kcal: 120, protein: 3.0, carbs: 12.0, fat: 7.0, fiber: 3.0 },
    { name: 'Aloo Gobi (1 serving)', kcal: 130, protein: 3.0, carbs: 16.0, fat: 6.0, fiber: 3.0 },
    { name: 'Dal Fry (1 serving)', kcal: 125, protein: 6.0, carbs: 16.0, fat: 4.0, fiber: 3.5 },
    { name: 'Egg Roll', kcal: 260, protein: 10.0, carbs: 28.0, fat: 12.0, fiber: 1.5 },
    { name: 'Paneer Roll', kcal: 300, protein: 10.0, carbs: 32.0, fat: 15.0, fiber: 2.5 },
    { name: 'Malai Kofta (1 serving)', kcal: 200, protein: 5.0, carbs: 18.0, fat: 12.0, fiber: 2.0 },
    { name: 'Kadai Paneer (1 serving)', kcal: 210, protein: 9.0, carbs: 12.0, fat: 15.0, fiber: 2.0 }
  ];

  var state = {
    mode: 'nutrition',
    gender: 'male',
    age: 30,
    weight: 70,
    height: 170,
    activity: 1.2,
    goal: 'maintain',
    log: [],
    budget: []
  };

  var GOAL_LABEL = { lose: 'goalLose', maintain: 'goalMaintain', gain: 'goalGain' };
  var FREQ_FACTOR = { daily: 30, weekly: 4.3333, monthly: 1 };

  // ---------- helpers ----------
  function polar(cx, cy, r, angleDeg) {
    var a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function arc(cx, cy, r, startAngle, endAngle) {
    var s = polar(cx, cy, r, endAngle);
    var e = polar(cx, cy, r, startAngle);
    var large = endAngle - startAngle <= 180 ? 0 : 1;
    return 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + e.x + ' ' + e.y;
  }

  function round(n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; }

  // ---------- nutrition ----------
  function computeNutrition() {
    var w = state.weight, h = state.height, age = state.age;
    if (!(w > 0 && h > 0 && age > 0)) return null;
    var bmr = 10 * w + 6.25 * h - 5 * age + (state.gender === 'male' ? 5 : -161);
    var tdee = bmr * state.activity;
    var target = tdee + (state.goal === 'lose' ? -500 : state.goal === 'gain' ? 300 : 0);
    if (target < 1000) target = 1000;

    var proteinG = 1.8 * w;
    var proteinKcal = proteinG * 4;
    var fatKcal = 0.25 * target;
    var fatG = fatKcal / 9;
    var carbsKcal = Math.max(0, target - proteinKcal - fatKcal);
    var carbsG = carbsKcal / 4;

    return {
      bmr: bmr, tdee: tdee, target: target,
      proteinG: proteinG, fatG: fatG, carbsG: carbsG,
      proteinKcal: proteinKcal, fatKcal: fatKcal, carbsKcal: carbsKcal,
      fiber: 14 * target / 1000,
      water: 35 * w,
      sugar: 0.05 * target / 4,
      satFat: 0.10 * target / 9
    };
  }

  function renderMacroChart(n) {
    var svg = $('macroChart');
    var total = n.proteinKcal + n.fatKcal + n.carbsKcal;
    var html = '';
    if (total > 0) {
      var p = n.proteinKcal / total, f = n.fatKcal / total, c = n.carbsKcal / total;
      var a1 = p * 360, a2 = (p + f) * 360;
      if (p > 0) html += '<path d="' + arc(80, 80, 70, 0, a1) + '" fill="#e11d48"/>';
      if (f > 0) html += '<path d="' + arc(80, 80, 70, a1, a2) + '" fill="#0ea5e9"/>';
      if (c > 0) html += '<path d="' + arc(80, 80, 70, a2, 360) + '" fill="#f59e0b"/>';
    }
    html += '<circle cx="80" cy="80" r="46" fill="#fff"/>';
    svg.innerHTML = html;
  }

  function renderNutrition() {
    var n = computeNutrition();
    if (!n) {
      $('bmr').textContent = $('targetCals').textContent = '-';
      $('goalLabel').textContent = '-';
      $('legendProtein').textContent = $('legendCarbs').textContent = $('legendFat').textContent = '-';
      $('fiber').textContent = $('water').textContent = $('sugar').textContent = $('satFat').textContent = '-';
      renderMacroChart({ proteinKcal: 0, fatKcal: 0, carbsKcal: 0 });
      return;
    }
    $('bmr').textContent = Math.round(n.tdee) + ' kcal';
    $('targetCals').textContent = Math.round(n.target) + ' kcal';
    $('goalLabel').textContent = t(GOAL_LABEL[state.goal]);
    $('legendProtein').textContent = 'Protein: ' + round(n.proteinG, 0) + ' g';
    $('legendCarbs').textContent = 'Carbs: ' + round(n.carbsG, 0) + ' g';
    $('legendFat').textContent = 'Fat: ' + round(n.fatG, 0) + ' g';
    $('fiber').textContent = round(n.fiber, 0) + ' g';
    $('water').textContent = Math.round(n.water) + ' ml';
    $('sugar').textContent = round(n.sugar, 0) + ' g';
    $('satFat').textContent = round(n.satFat, 0) + ' g';
    renderMacroChart(n);
    renderFoodVsTarget(n.target);
    renderComparison();
  }

  // ---------- food log ----------
  var selectedFood = null;

  var GRAM_FACTOR = {
    'g': 1, 'ml': 1, 'pcs': 1, 'cup': 240, 'spoon': 15,
    'tbsp': 15, 'tsp': 5, 'serving': 150, 'bowl': 200,
    'plate': 300, 'glass': 250, 'slice': 30
  };

  function renderFoodDropdown(query) {
    var dd = $('foodDropdown');
    if (!dd) return;
    var q = (query || '').toLowerCase();
    var items = q.length > 0
      ? FOOD_DB.filter(function (f) { return f.name.toLowerCase().indexOf(q) !== -1; }).slice(0, 10)
      : FOOD_DB.slice(0, 10);
    if (items.length === 0) { dd.innerHTML = ''; dd.style.display = 'none'; return; }
    dd.innerHTML = items.map(function (f) {
      return '<div class="food-dd-item" data-name="' + f.name.replace(/"/g, '&quot;') + '">' +
        '<span class="food-dd-name">' + f.name + '</span>' +
        '<span class="food-dd-cals">~' + f.kcal + ' kcal/100g</span>' +
        '</div>';
    }).join('');
    dd.style.display = 'block';
  }

  function tryAutoMatch(query) {
    if (!query) return null;
    var q = query.toLowerCase().trim();
    for (var i = 0; i < FOOD_DB.length; i++) {
      if (FOOD_DB[i].name.toLowerCase() === q) return FOOD_DB[i];
    }
    return null;
  }

  function addFood() {
    var name, nutrients;
    var qty = parseDigits($('foodQtyInput').value) || 1;
    var unit = $('foodUnitSelect').value;

    if (selectedFood) {
      name = selectedFood.name;
      nutrients = selectedFood;
    } else {
      var typed = $('foodSearch').value.trim();
      var match = tryAutoMatch(typed);
      if (match) { name = match.name; nutrients = match; }
    }

    if (!nutrients) return;

    var gramsEquivalent = qty * (GRAM_FACTOR[unit] || 1);
    var factor = gramsEquivalent / 100;
    state.log.push({
      name: name,
      grams: gramsEquivalent,
      qty: qty,
      unit: unit,
      kcal: nutrients.kcal * factor,
      protein: nutrients.protein * factor,
      carbs: nutrients.carbs * factor,
      fat: nutrients.fat * factor,
      fiber: nutrients.fiber * factor
    });
    renderFoodLog();
    $('foodSearch').value = '';
    selectedFood = null;
    $('foodDropdown').innerHTML = '';
    $('foodDropdown').style.display = 'none';
    $('foodQtyInput').value = 1;
    renderComparison();
  }

  function renderFoodLog() {
    var body = $('foodLogBody');
    if (!state.log.length) {
      body.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748b;padding:18px" data-i18n="foodEmpty">' + t('foodEmpty') + '</td></tr>';
      $('foodTotalKcal').textContent = '-';
      $('foodVsTarget').textContent = '-';
      $('foodNote').textContent = '';
      $('foodTotalProtein').textContent = '-';
      $('foodTotalCarbs').textContent = '-';
      $('foodTotalFat').textContent = '-';
      $('foodTotalFiber').textContent = '-';
      return;
    }
    var total = 0, totalP = 0, totalC = 0, totalF = 0, totalFb = 0;
    body.innerHTML = state.log.map(function (r, i) {
      total += r.kcal;
      totalP += r.protein;
      totalC += r.carbs;
      totalF += r.fat;
      totalFb += r.fiber;
      var qtyStr = r.qty + ' ' + r.unit;
      return '<tr><td>' + r.name + '</td><td>' + qtyStr + '</td><td>' + Math.round(r.kcal) +
             '</td><td><button type="button" class="row-del" data-i="' + i + '" aria-label="Remove">\u2715</button></td></tr>';
    }).join('');
    $('foodTotalKcal').textContent = Math.round(total) + ' kcal';
    $('foodTotalProtein').textContent = round(totalP, 0) + ' g';
    $('foodTotalCarbs').textContent = round(totalC, 0) + ' g';
    $('foodTotalFat').textContent = round(totalF, 0) + ' g';
    $('foodTotalFiber').textContent = round(totalFb, 0) + ' g';
    renderFoodVsTarget(computeNutrition() ? computeNutrition().target : 0, total);
    renderComparison();
  }

  function renderFoodVsTarget(target, logTotal) {
    if (!target || !state.log.length) { $('foodVsTarget').textContent = '-'; $('foodNote').textContent = ''; return; }
    logTotal = (logTotal != null) ? logTotal : state.log.reduce(function (s, r) { return s + r.kcal; }, 0);
    var diff = target - logTotal;
    $('foodVsTarget').textContent = (diff >= 0 ? '+' : '') + Math.round(diff) + ' kcal';
    $('foodNote').textContent = diff >= 0 ? t('foodUnderNote') : t('foodOverNote');
  }

  function renderComparison() {
    var n = computeNutrition();
    var log = state.log;
    
    // Calculate actual totals from food log
    var actualCal = 0, actualProtein = 0, actualCarbs = 0, actualFat = 0, actualFiber = 0;
    log.forEach(function(r) {
      actualCal += r.kcal;
      actualProtein += r.protein;
      actualCarbs += r.carbs;
      actualFat += r.fat;
      actualFiber += r.fiber;
    });

    // Update comparison table
    if (n) {
      // Calories
      $('compTargetCal').textContent = Math.round(n.target) + ' kcal';
      $('compActualCal').textContent = Math.round(actualCal) + ' kcal';
      var calDiff = n.target - actualCal;
      $('compStatusCal').textContent = calDiff >= 0 ? '+' + Math.round(calDiff) : Math.round(calDiff);
      $('compStatusCal').className = calDiff >= 0 ? 'status-good' : 'status-bad';

      // Protein
      $('compTargetProtein').textContent = round(n.proteinG, 0) + ' g';
      $('compActualProtein').textContent = round(actualProtein, 0) + ' g';
      var protDiff = n.proteinG - actualProtein;
      $('compStatusProtein').textContent = protDiff >= 0 ? '+' + round(protDiff, 0) : round(protDiff, 0);
      $('compStatusProtein').className = protDiff >= 0 ? 'status-good' : 'status-warning';

      // Carbs
      $('compTargetCarbs').textContent = round(n.carbsG, 0) + ' g';
      $('compActualCarbs').textContent = round(actualCarbs, 0) + ' g';
      var carbsDiff = n.carbsG - actualCarbs;
      $('compStatusCarbs').textContent = carbsDiff >= 0 ? '+' + round(carbsDiff, 0) : round(carbsDiff, 0);
      $('compStatusCarbs').className = carbsDiff >= 0 ? 'status-good' : 'status-warning';

      // Fat
      $('compTargetFat').textContent = round(n.fatG, 0) + ' g';
      $('compActualFat').textContent = round(actualFat, 0) + ' g';
      var fatDiff = n.fatG - actualFat;
      $('compStatusFat').textContent = fatDiff >= 0 ? '+' + round(fatDiff, 0) : round(fatDiff, 0);
      $('compStatusFat').className = fatDiff >= 0 ? 'status-good' : 'status-warning';

      // Fiber
      $('compTargetFiber').textContent = round(n.fiber, 0) + ' g';
      $('compActualFiber').textContent = round(actualFiber, 0) + ' g';
      var fiberDiff = n.fiber - actualFiber;
      $('compStatusFiber').textContent = fiberDiff >= 0 ? '+' + round(fiberDiff, 0) : round(fiberDiff, 0);
      $('compStatusFiber').className = fiberDiff >= 0 ? 'status-good' : 'status-bad';

      // Water (estimated from food)
      var actualWater = actualCal * 0.001; // rough estimate
      $('compTargetWater').textContent = Math.round(n.water) + ' ml';
      $('compActualWater').textContent = '~' + Math.round(actualWater) + ' ml';
      $('compStatusWater').textContent = '-';
      $('compStatusWater').className = 'status-neutral';

      // Sugar (max)
      $('compTargetSugar').textContent = round(n.sugar, 0) + ' g';
      $('compActualSugar').textContent = '-';
      $('compStatusSugar').textContent = 'log food';
      $('compStatusSugar').className = 'status-neutral';

      // Saturated Fat (max)
      $('compTargetSatFat').textContent = round(n.satFat, 0) + ' g';
      $('compActualSatFat').textContent = '-';
      $('compStatusSatFat').textContent = 'log food';
      $('compStatusSatFat').className = 'status-neutral';
    } else {
      // No nutrition data yet
      $('compTargetCal').textContent = '-';
      $('compActualCal').textContent = Math.round(actualCal) + ' kcal';
      $('compStatusCal').textContent = '-';
      $('compStatusCal').className = 'status-neutral';
    }
  }

  // ---------- budget ----------
  function addBudgetRow(item) {
    item = item || { name: '', price: 0, qty: 1, freq: 'monthly' };
    state.budget.push(item);
    renderBudget();
  }

  function renderBudget() {
    var body = $('budgetBody');
    if (!state.budget.length) {
      body.innerHTML = '';
      $('budgetEmptyNote').style.display = '';
      $('budgetTotalVal').textContent = $('budgetPerDayVal').textContent = $('budgetPerPersonVal').textContent = '-';
      return;
    }
    $('budgetEmptyNote').style.display = 'none';
    var total = 0;
    body.innerHTML = state.budget.map(function (r, i) {
      var monthly = (parseDigits(r.price) || 0) * (parseDigits(r.qty) || 0) * (FREQ_FACTOR[r.freq] || 1);
      total += monthly;
      return '<tr>' +
        '<td><input type="text" class="cell-input" data-i="' + i + '" data-f="name" value="' + escapeAttr(r.name) + '"></td>' +
        '<td><input type="number" class="cell-input" data-i="' + i + '" data-f="price" value="' + r.price + '"></td>' +
        '<td><input type="number" class="cell-input" data-i="' + i + '" data-f="qty" value="' + r.qty + '"></td>' +
        '<td><select class="cell-input" data-i="' + i + '" data-f="freq">' +
          '<option value="daily"' + (r.freq === 'daily' ? ' selected' : '') + '>' + t('freqDaily') + '</option>' +
          '<option value="weekly"' + (r.freq === 'weekly' ? ' selected' : '') + '>' + t('freqWeekly') + '</option>' +
          '<option value="monthly"' + (r.freq === 'monthly' ? ' selected' : '') + '>' + t('freqMonthly') + '</option>' +
        '</select></td>' +
        '<td>' + currency(monthly) + '</td>' +
        '<td><button type="button" class="row-del" data-i="' + i + '" aria-label="Remove">✕</button></td>' +
      '</tr>';
    }).join('');

    var people = Math.max(1, parseDigits($('peopleInput').value) || 1);
    $('budgetTotalVal').textContent = currency(total);
    $('budgetPerDayVal').textContent = currency(total / 30);
    $('budgetPerPersonVal').textContent = currency(total / people);
  }

  function escapeAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }

  // ---------- mode switch ----------
  function setMode(mode) {
    state.mode = mode;
    $('modeTabs').querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b.dataset.mode === mode); });
    $('nutritionView').style.display = mode === 'nutrition' ? '' : 'none';
    $('budgetView').style.display = mode === 'budget' ? '' : 'none';
  }

  // ---------- wire up ----------

  $('modeTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    setMode(b.dataset.mode);
  });

  $('genderTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.gender = b.dataset.gender;
    $('genderTabs').querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderNutrition();
  });
  $('activityTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.activity = parseFloat(b.dataset.act);
    $('activityTabs').querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderNutrition();
  });
  $('goalTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.goal = b.dataset.goal;
    $('goalTabs').querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderNutrition();
  });

  $('ageInput').addEventListener('input', function (e) { state.age = parseDigits(e.target.value); $('ageSlider').value = state.age; renderNutrition(); });
  $('ageSlider').addEventListener('input', function (e) { state.age = Number(e.target.value); $('ageInput').value = state.age; renderNutrition(); });
  $('weightInput').addEventListener('input', function (e) { state.weight = parseDigits(e.target.value); $('weightSlider').value = state.weight; renderNutrition(); });
  $('weightSlider').addEventListener('input', function (e) { state.weight = Number(e.target.value); $('weightInput').value = state.weight; renderNutrition(); });
  $('heightInput').addEventListener('input', function (e) { state.height = parseDigits(e.target.value); $('heightSlider').value = state.height; renderNutrition(); });
  $('heightSlider').addEventListener('input', function (e) { state.height = Number(e.target.value); $('heightInput').value = state.height; renderNutrition(); });

  $('foodSearch').addEventListener('focus', function () {
    renderFoodDropdown($('foodSearch').value.trim());
  });

  $('foodSearch').addEventListener('input', function (e) {
    var v = e.target.value.trim();
    selectedFood = null;
    renderFoodDropdown(v);
    var match = tryAutoMatch(v);
    if (match) { selectedFood = match; }
  });

  $('foodDropdown').addEventListener('mousedown', function (e) {
    e.preventDefault();
    var item = e.target.closest('.food-dd-item');
    if (!item) return;
    var name = item.dataset.name;
    var food = FOOD_DB.find(function (f) { return f.name === name; });
    if (!food) return;
    selectedFood = food;
    $('foodSearch').value = food.name;
    $('foodDropdown').innerHTML = '';
    $('foodDropdown').style.display = 'none';
  });

  $('addFoodBtn').addEventListener('click', addFood);
  $('foodQtyInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') addFood(); });
  $('foodSearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addFood(); } });

  $('foodLogBody').addEventListener('click', function (e) {
    var b = e.target.closest('.row-del'); if (!b) return;
    state.log.splice(parseInt(b.dataset.i, 10), 1);
    renderFoodLog();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.food-combobox')) {
      var dd = $('foodDropdown');
      if (dd) { dd.innerHTML = ''; dd.style.display = 'none'; }
    }
  });

  $('peopleInput').addEventListener('input', renderBudget);
  $('addBudgetBtn').addEventListener('click', function () { addBudgetRow(); });
  $('budgetBody').addEventListener('input', function (e) {
    var el = e.target.closest('.cell-input'); if (!el) return;
    var i = parseInt(el.dataset.i, 10), f = el.dataset.f;
    state.budget[i][f] = (f === 'name') ? el.value : parseDigits(el.value);
    renderBudget();
  });
  $('budgetBody').addEventListener('click', function (e) {
    var b = e.target.closest('.row-del'); if (!b) return;
    state.budget.splice(parseInt(b.dataset.i, 10), 1);
    renderBudget();
  });

  // seed a couple of budget rows so the planner is immediately useful
  if (!state.budget.length) {
    addBudgetRow({ name: 'Rice & grains', price: 600, qty: 1, freq: 'monthly' });
    addBudgetRow({ name: 'Vegetables & fruits', price: 60, qty: 1, freq: 'daily' });
    addBudgetRow({ name: 'Milk (1 L)', price: 70, qty: 2, freq: 'daily' });
  }

  document.addEventListener('langchange', function () {
    renderNutrition();
    renderFoodLog();
    renderBudget();
    renderComparison();
  });

  setMode('nutrition');
  renderNutrition();
  renderFoodLog();
  renderBudget();
  renderComparison();
})();
