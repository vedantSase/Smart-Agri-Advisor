module.exports = {
    // ensureAuthenticated: function (req, res, next) {
    //     if(req.isAuthenticated()) {
    //         return next() ;
    //     }
    //     req.flash('error_msg', 'Please log in to view this page');
    //     res.redirect('/user/login_page');
    // }   


    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
    
        // Initialize a stack if not present
        if (!req.session.returnToStack) {
            req.session.returnToStack = [];
        }
    
        // Push current route to stack
        req.session.returnToStack.push(req.originalUrl);
    
        req.flash('error_msg', 'Please log in to view this page');
        res.redirect('/user/login_page');
    }
    
}