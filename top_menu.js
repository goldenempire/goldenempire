module.exports = function(app){
    app.get('/about1', function(req,res){
        res.render('index', {
            message : 'De groeten'
        });
    });
};