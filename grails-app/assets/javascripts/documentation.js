$(document).ready(function () {

    if ($('body').data('page') === 'documentation-category') {

        $(function() {
            var Accordion = function(el, multiple) {
                this.el = el || {};
                // more then one submenu open?
                this.multiple = multiple || false;

                var dropdownLink = this.el.find('.dropdownlink');
                dropdownLink.on('click',
                    { el: this.el, multiple: this.multiple },
                    this.dropdown);
            };

            Accordion.prototype.dropdown = function(e) {
                var $el = e.data.el,
                    $this = $(this),
                //this is the ul.submenu-list
                    $next = $this.next();

                $next.slideToggle();
                $this.parent().toggleClass('open');

                $next.on("click", "li", function (event) {
                    console.log($(".submenu-item.current-article"));
                    console.log($(".submenu-item"));
                    var clickedItemId = this.id;
                    var currentSelectedMenuItem = $(".submenu-item.current-article")
                    var currentArticleId = currentSelectedMenuItem[0].id;

                    console.log('clickedItemId: '+clickedItemId);
                    console.log('currentArticleId: '+currentArticleId);

                    if (clickedItemId != currentArticleId) {
                        //deselect old article menu item and hide article
                        currentSelectedMenuItem.closest('li').removeClass('current-article');
                        $(".article-view." + currentArticleId).hide();

                        //select new article menu item and show article
                        $(this).closest('li').addClass('current-article');
                        $(".article-view." + clickedItemId).show();
                        $(".article-title").text(articleInfo[clickedItemId].name);
                        $(".article-updated-time").text(articleInfo[clickedItemId].updated)
                    }
                });

                if(!e.data.multiple) {
                    //show only one menu at the same time
                    $el.find('.submenu-list').not($next).slideUp().parent().removeClass('open');
                }
            }

            var accordion = new Accordion($('.accordion-menu'), false);

            //open first section of the menu
            $('.dropdownlink')[0].closest('div').click()
        })

    }



});
