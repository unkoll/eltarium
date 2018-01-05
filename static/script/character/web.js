/**
 * Created by unkoll on 30.06.17.
 */
var Web = {
    get_player : function (mode) {
        var query;
        if (mode === 'test') {
            query = Const.test_player;
        }
        else {
            //AJAX-query to backend server
        }
        return query;
    },
    commit : function () {
        //AJAX-query to backend server
    }
};

