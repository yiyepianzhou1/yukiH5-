/**
 * Created by Administrator on 2017/5/27 0027.
 */
$(function(){
    function DaoJiShi(el,opts){
        this.$el = $(el);
        this.opts = $.extend([],DaoJiShi.DEFAULTS,opts);
        this._setRemainTime();
    }
    DaoJiShi.DEFAULTS = {
        leftTime  : 1800000,
        callbacks  : function(){
            return false;
        }
    };

    DaoJiShi.prototype._setRemainTime = function (){
        var $el = this.$el;
        var midtime = this.opts.leftTime / 1000;
        var $this = this;
        var InterValObj;
        $(document).ready(function() {
            InterValObj = window.setInterval(SetRemainTime, 1000);
        });
        function SetRemainTime() {
            if (midtime > 1) {
                midtime = midtime - 1;
                var second = Math.floor(midtime % 60);
                var minite = Math.floor((midtime / 60) % 60);
                var hour = Math.floor((midtime / 3600) % 24);
                console.log(hour);
                $el.find(".hour").text(hour);
                $el.find(".minite").text(minite);
                $el.find(".second").text(second);
            } else {
                window.clearInterval(InterValObj);
                $this.opts.callbacks();
            }
        }
    };
    $.fn.extend({
        daoJiShi : function(opts){
            return this.each(function(){
                new DaoJiShi($(this),opts);
            })
        }
    });
    return {
        daoJiShi : DaoJiShi
    }
});