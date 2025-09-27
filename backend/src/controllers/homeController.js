const homeController = {
    getHome: (req, res) => {
        res.json({ 
            page: "Home",
            message: "Welcome to the Online Shop API!"
        });
    }
};

export default homeController