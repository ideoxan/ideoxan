mkdir static/curriculum
cd static/curriculum
git clone https://github.com/ideoxan/curriculum-tutorial/
cd ../../
OPTIMIZE=true node css_optimizer.js
npm run start