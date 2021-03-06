(function () {
    'use strict';
    var adminView, editControls, manageView, manageControls, projectsControls, projectsView, drawCanvas, setDrawPanel, setManagePanel, tourModel;
    adminView = function () {
        var my = {
            rooms: {},
        },
            self = {
                room_list: $("#edit_screen_list")
            };
        self.update = function (rooms) {
            $.each(rooms, function (id, room) {
                self.makeRoom(id, room);
            });
        };
        self.makeRoom = function (id, room_data) {
            var new_room,
                new_room_views_div;
            if (!my.rooms.hasOwnProperty(id)) {
                new_room = $("<h3>" + room_data.name + "</h3>");
                new_room_views_div = $("<div></div>");
                new_room_views_div.addClass("screen_item");
                self.room_list.append(new_room);
                new_room.after(new_room_views_div);
                my.rooms[id] = {room: new_room, room_views_div: new_room_views_div, room_views: []};
            } else {
                new_room = my.rooms[id].room;
                new_room_views_div = my.rooms[id].room_views_div;
            }
            $.each(room_data.room_views, function (index, room_view) {
                if (my.rooms[id].room_views.indexOf(room_view.id) < 0) {
                    self.makeRoomView(new_room_views_div, room_view);
                    my.rooms[id].room_views.push(room_view.id);
                }
            });
            new_room.attr('object_id', id);
            $("#edit_screen_list").accordion("refresh");
        };
        self.makeRoomView = function (room_view_div, room_view_data) {
            var new_room_view_div,
                new_room_view,
                new_room_view_title;
            new_room_view_div = $("<div></div>");
            new_room_view_div.attr("id", room_view_data.id);
            new_room_view = $("<img>").addClass("screen_item_thumb");
            new_room_view.attr("src", room_view_data.src);
            new_room_view_title = $("<p>" + room_view_data.name + "</p>");
            new_room_view_div.append(new_room_view);
            new_room_view_div.append(new_room_view_title);
            room_view_div.append(new_room_view_div);
            new_room_view_div.click(function () {
                var target = this;
                my.canvas_ctrl.setActiveRoomView(target);
            });
        };
        self.setActiveRoomView = function (room_view_data) {
            console.log("View controller received the following via setActiveRoomView:");
            console.log(room_view_data);
        };
        self.setController = function (canvas_ctrl) {
            my.canvas_ctrl = canvas_ctrl;
        };
        return self;
    };
    editControls = function (view, canvasctrl, tour_model) {
        var my = {};
        view.setController(this);
        if (canvasctrl === undefined) {
            canvasctrl = drawCanvas();
        }
        if (tour_model === undefined) {
            tour_model = tourModel();
        }
        var modes = canvasctrl.getModes(),
            self = {};
        self.addRoom = function () {
            tour_model.addRoom();
            view.update(tour_model.getRooms());
        };
        self.addRoomView = function () {
            tour_model.addRoomView();
            view.update(tour_model.getRooms());
        };
        self.setActiveRoomView = function (room_view) {
            if (my.hasOwnProperty('room_view_data') && my.room_view_data !== null) {
                my.room_view_data.shapes = canvasctrl.getShapes();
            }
            tour_model.updateRoomView(my.room_view_data);
            my.room_view_data = tour_model.getRoomView(room_view.id);
            my.room_view_room = tour_model.getActiveRoomID();
            view.setActiveRoomView(my.room_view_data);
            canvasctrl.setRoomViewData(my.room_view_data);
        };
        self.setActiveRoom = function (room) {
            var object_id = room.attr("object_id");
            tour_model.setActiveRoom(object_id);
        };
        self.setMode = function (mode) {
            canvasctrl.setMode(modes[mode]);
        };
        return self;
    };
    manageControls = function (view, canvasctrl, tour_model) {
        var my = {},
            self = {};
        view.setController(this);
        if (canvasctrl === undefined) {
            canvasctrl = drawCanvas();
        }
        if (tour_model === undefined) {
            tour_model = tourModel();
        }
        self.refreshList = function () {
            // Refresh the view with new data
        };
        self.selectImage = function (id) {
            var room_view = tour_model.getRoomView(id);
            view.selectImage(id);
            view.setActiveImage(room_view);
        };
        self.uploadImage = function () {
            var fileman = $("#manage_file");
            fileman.click();
            fileman.change(function (data) {
                var reader = false,
                    formdata = false,
                    i,
                    len = this.files.length,
                    img,
                    file;
                if (window.FormData) {
                    formdata = new FormData();
                }
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function (e) {
                        showUploadedItem(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                //document.getElementById("response").innerHTML = "Uploading . . .";
                console.log("Uploading...");
                for (i = 0; i < len; i += 1) {
                    file = this.files[i];

                    if (!!file.type.match(/image.*/)) {
                        if (window.FileReader) {
                            reader = new FileReader();
                            reader.onloadend = function (e) {
                                console.log("loaded");
                                console.log(e);
                                //showUploadedItem(e.target.result);
                            };
                            reader.readAsDataURL(file);
                        }
                        if (formdata) {
                            formdata.append("images_" + [i], file);
                        }
                    }
                }
                if (formdata) {
                    formdata.append("action", "upload");
                    $.ajax({
                        url: "images/manage",
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            document.getElementById("response").innerHTML = res;
                        },
                        error: function (res) {
                            console.log(res);
                        }
                    });
                }
            });
        };
        return self;
    };
    manageView = function () {
        var my = {
            canvas_ctrl: null
        },
        self = {};
        self.selectImage = function (id) {
            console.log(id);
        };
        self.setActiveImage = function (image_data) {
            console.log(image_data);
        };
        self.setController = function (canvas_ctrl) {
            my.canvas_ctrl = canvas_ctrl;
        };
        return self;
    };
    projectsControls =  function () {
        var my = {
                index: null
            },
            self = {};
        self.openProject = function (id) {
            //Code for retrieving a project from DB
        };
        self.saveProject = function (project) {
            //Code for saving project.
            //If 'project' param is not null, save or update it.
            //Otherwise, if there's a project open, save that one.
            //Otherwise return null or throw error or something.
        };
        self.closeProject = function () {};
        self.deleteProject = function (id) {
            //Delete the project identified by 'id' param.
        };
        self.buildProjectsIndex = function () {
            //build list of all projects with main images, create dates, etc.
            //assign it to a 'my' field.
        };
        self.getProjectsIndex = function () {
            if (my.index === null){
                self.buildProjectsIndex();
            }
            //Get brief list of all projects, main images, create dates, etc.
            return my.index;
        };
    };
    projectsView = function () {
        var my = {},
            self = {};
        self.selectProject = function (id) {
            console.log(id);
        };
        self.openProject = function (id) {
            console.log(id);
        };
        self.setController = function (projects_ctrl) {
            my.project_ctrl = projects_ctrl;
        };
        return self;
    };
    drawCanvas = function () {
        var my_canvas = $("#main_pic_edit_canvas")[0],
            modes = {
                DRAWING: 0,
                MOVING: 1,
                RESIZING: 5,
                MODIFYING: 2,
                ERASING: 3,
                TESTING: 4
            },
            my = {
                canvas: my_canvas,
                draw2d: my_canvas.getContext("2d"),
                last_mousedown: {x: 0, y: 0},
                mode: modes.DRAWING,
                mouse_held: false,
                move_shape: null,
                move_edge: 0,
                outlineRectangle: function (shape) {
                    my.draw2d.lineWidth = 2;
                    my.draw2d.fillStyle = "rgba(0, 128, 200, 0.2)";
                    my.draw2d.strokeRect(shape.x1, shape.y1, shape.x2, shape.y2);
                    my.draw2d.fillRect(shape.x1, shape.y1, shape.x2, shape.y2);
                },
                shapes: [],
                edge_threshold: 8
            },
            parts = {
                TOP: 1,
                TOPRIGHT: 4,
                RIGHT: 3,
                BOTTOMRIGHT: 8,
                BOTTOM: 5,
                BOTTOMLEFT: 14,
                LEFT: 9,
                TOPLEFT: 10
            },
            pointers = {
                ALL_SCROLL: 'all-scroll',
                0: 'auto',
                COL_RESIZE: 'col-resize',
                DEFAULT: 'default',
                DRAWING: 'crosshair',
                HELP: 'help',
                INHERIT: 'inherit',
                MOVING: 'move',
                NODROP: 'no-drop',
                NOT_ALLOWED: 'not-allowed',
                POINTER: 'pointer',
                PROGRESS: 'progress',
                ROW_RESIZE: 'row-resize',
                TEXT: 'text',
                VERT_TEXT: 'vertical-text',
                WAIT: 'wait',
                1: 'n-resize',
                4: 'ne-resize',
                3: 'e-resize',
                8: 'se-resize',
                5: 's-resize',
                14: 'sw-resize',
                9: 'w-resize',
                10: 'nw-resize'
            },
            self = {},
            x,
            y;
        my_canvas.onmousedown = function (event) {
            my.mouse_held = true;
            x = event.offsetX;
            y = event.offsetY;
            my.last_mousedown.x = x;
            my.last_mousedown.y = y;
            if (my.mode === modes.MODIFYING) {
                return;
            }
            my.move_shape = self.findShape(x, y, true);
            if (my.move_shape !== null && my.mode === modes.DRAWING) {
                my.move_edge = self.nearEdge(my.move_shape, x, y);
                my.mode = modes.MOVING;
            }
        };
        my_canvas.onmouseup = function (event) {
            my_canvas.style.cursor = pointers[0];
            if (!my.mouse_held) {
                return;
            }
            x = event.offsetX;
            y = event.offsetY;
            if (my.mode === modes.MODIFYING) {
                self.selectShape(x, y);
                return;
            }
            if (my.mode === modes.ERASING) {
                delete (my.move_shape);
                self.drawRects();
            } else if (my.mode === modes.DRAWING) {
                self.addShape(my.last_mousedown.x, my.last_mousedown.y,
                    x - my.last_mousedown.x, y - my.last_mousedown.y);
            } else if (my.move_shape !== null) {
                my.move_shape = self.moveShape(x, y);
                my.shapes.push(my.move_shape);
                my.move_shape = null;
                self.drawRects();
                my.mode = modes.DRAWING;
            }
            my.mouse_held = false;
        };
        my_canvas.onmousemove = function (event) {
            var current_shape, new_shape, edge;
            x = event.offsetX;
            y = event.offsetY;
            if (!my.mouse_held) {
                current_shape = self.findShape(x, y);
                if (current_shape !== null) {
                    edge = self.nearEdge(current_shape, x, y);
                    my_canvas.style.cursor = pointers[edge];
                } else {
                    my_canvas.style.cursor = pointers[0];
                }
                return;
            }
            if (my.mode === modes.MODIFYING) {
                return;
            }
            if (my.mode === modes.DRAWING) {
                new_shape = {
                    x1: my.last_mousedown.x,
                    y1: my.last_mousedown.y,
                    x2: x - my.last_mousedown.x,
                    y2: y - my.last_mousedown.y
                };
                self.drawRects(new_shape);
                my_canvas.style.cursor = pointers.DRAWING;
            }
            if (my.mode === modes.MOVING && my.move_shape !== null) {
                new_shape = self.moveShape(x, y);
                my_canvas.style.cursor = pointers.MOVING;
            }
        };
        my_canvas.onmouseleave = function (event) {
            x = event.offsetX;
            y = event.offsetY;
            //my.mouse_held = false;
        };
        my_canvas.onmouseover = function (event) {
            x = event.offsetX;
            y = event.offsetY;
        };
        self.moveShape = function (x, y) {
            var x_change, y_change, new_shape;
            x_change = x - my.last_mousedown.x;
            y_change = y - my.last_mousedown.y;
            if (my.move_edge === 0) {
                new_shape = {
                    x1: my.move_shape.x1 + x_change,
                    x2: my.move_shape.x2,
                    y1: my.move_shape.y1 + y_change,
                    y2: my.move_shape.y2
                };
            } else if (my.move_edge === parts.TOP) {
                new_shape = {
                    x1: my.move_shape.x1,
                    x2: my.move_shape.x2,
                    y1: my.move_shape.y1 + y_change,
                    y2: my.move_shape.y2 - y_change
                };
            } else if (my.move_edge === parts.TOPRIGHT) {
                new_shape = {
                    x1: my.move_shape.x1,
                    x2: my.move_shape.x2 + x_change,
                    y1: my.move_shape.y1 + y_change,
                    y2: my.move_shape.y2 - y_change
                };
            } else if (my.move_edge === parts.RIGHT) {
                new_shape = {
                    x1: my.move_shape.x1,
                    x2: my.move_shape.x2 + x_change,
                    y1: my.move_shape.y1,
                    y2: my.move_shape.y2
                };
            } else if (my.move_edge === parts.BOTTOMRIGHT) {
                new_shape = {
                    x1: my.move_shape.x1,
                    x2: my.move_shape.x2 + x_change,
                    y1: my.move_shape.y1,
                    y2: my.move_shape.y2 + y_change
                };
            } else if (my.move_edge === parts.BOTTOM) {
                new_shape = {
                    x1: my.move_shape.x1,
                    x2: my.move_shape.x2,
                    y1: my.move_shape.y1,
                    y2: my.move_shape.y2 + y_change
                };
            } else if (my.move_edge === parts.BOTTOMLEFT) {
                new_shape = {
                    x1: my.move_shape.x1 + x_change,
                    x2: my.move_shape.x2 - x_change,
                    y1: my.move_shape.y1,
                    y2: my.move_shape.y2 + y_change
                };
            } else if (my.move_edge === parts.LEFT) {
                new_shape = {
                    x1: my.move_shape.x1 + x_change,
                    x2: my.move_shape.x2 - x_change,
                    y1: my.move_shape.y1,
                    y2: my.move_shape.y2
                };
            } else if (my.move_edge === parts.TOPLEFT) {
                new_shape = {
                    x1: my.move_shape.x1 + x_change,
                    x2: my.move_shape.x2 - x_change,
                    y1: my.move_shape.y1 + y_change,
                    y2: my.move_shape.y2 - y_change
                };
            }
            self.drawRects(new_shape);
            return new_shape;
        };
        self.makeShape = function (in_x1, in_y1, in_x2, in_y2) {
            var tlx, tly, brx, bry, new_shape;
            if (in_x2 > 0) {
                tlx = in_x1;
                brx = in_x2;
            } else {
                tlx = in_x1 + in_x2;
                brx = -in_x2;
            }
            if (in_y2 > 0) {
                tly = in_y1;
                bry = in_y2;
            } else {
                tly = in_y1 + in_y2;
                bry = -in_y2;
            }
            new_shape = {
                x1: tlx,
                y1: tly,
                x2: brx,
                y2: bry
            };
            return new_shape;
        };
        self.selectShape = function (x, y) {
            var shape = self.findShape(x, y);
            self.drawRects();
            my.selectedShape = shape;
            self.highlightShape(shape);
        };
        self.drawRects = function (current_shape) {
            var i, shape_count = my.shapes.length;
            my.draw2d.clearRect(0, 0, my.canvas.width, my.canvas.height);
            for (i = shape_count - 1; i >= 0; i -= 1) {
                my.outlineRectangle(my.shapes[i]);
            }
            if (current_shape !== undefined) {
                my.outlineRectangle(current_shape);
            }
        };
        self.addShape = function (x1, y1, x2, y2) {
            if (!(x2 && y2)) {
                return;
            }
            var new_shape = self.makeShape(x1, y1, x2, y2);
            my.shapes.push(new_shape);
        };
        self.findShape = function (x, y, pop_it) {
            var i, current_shape;
            for (i = my.shapes.length - 1; i >= 0; i -= 1) {
                current_shape = my.shapes[i];
                if (x >= current_shape.x1 && x <= current_shape.x1 + current_shape.x2
                    && y >= current_shape.y1 && y <= current_shape.y1 + current_shape.y2) {
                    if (pop_it) {
                        my.shapes.splice(i, 1);
                    }
                    return current_shape;
                }
            }
            return null;
        };
        self.highlightShape = function (shape) {
            my.draw2d.lineWidth = 2;
            my.draw2d.fillStyle = "rgba(0, 255, 0, 0.4)";
            my.draw2d.strokeRect(shape.x1, shape.y1, shape.x2, shape.y2);
            my.draw2d.fillRect(shape.x1, shape.y1, shape.x2, shape.y2);
        };
        self.nearEdge = function (shape, x, y) {
            var x_ldiff, x_rdiff, y_tdiff, y_bdiff, part = 0;
            x_ldiff = Math.abs(x - shape.x1);
            x_rdiff = Math.abs(x - (shape.x1 + shape.x2));
            y_tdiff = Math.abs(y - shape.y1);
            y_bdiff = Math.abs(y - (shape.y1 + shape.y2));
            if (x_ldiff <= my.edge_threshold) {
                part += parts.LEFT;
            } else if (x_rdiff <= my.edge_threshold) {
                part += parts.RIGHT;
            }
            if (y_tdiff <= my.edge_threshold) {
                part += parts.TOP;
            } else if (y_bdiff <= my.edge_threshold) {
                part += parts.BOTTOM;
            }
            return part;
        };
        self.getMode = function () {
            return my.mode;
        };
        self.getModes = function () {
            return modes;
        };
        self.setMode = function (mode) {
            my.mode = mode;
        };
        self.setRoomViewData = function (data) {
            console.log("Canvas control received the following via setRoomViewData:");
            console.log(data);
            my.shapes = data.shapes;
            self.drawRects();
        };
        self.getShapes = function () {
            return my.shapes;
        };
        return self;
    };
    setDrawPanel = function (edit_ctrl) {
        if (edit_ctrl === undefined) {
            edit_ctrl = editControls();
        }
        $("#app_tabs").tabs();
        $("#edit_screen_list").accordion({heightStyle: "content"});
        $("#edit_screen_list").on("accordionactivate", function (event, ui) {
            edit_ctrl.setActiveRoom(ui.newHeader);
        });
        $("#add_room").button().click(function () {
            edit_ctrl.addRoom();
        });
        $("#add_room_view").button().click(function () {
            edit_ctrl.addRoomView();
        });
        $("#edit_tools").accordion({heightStyle: "fill"});
        $("#edit_mode").buttonset();
        $("#edit_mode").children("input").click(function (e) {
            edit_ctrl.setMode(e.currentTarget.value);
        });
    };
    setManagePanel = function (manage_ctrl) {
        if (manage_ctrl === undefined) {
            manage_ctrl = manageControls();
        }
        $("input.manage_button").button();
        $("#manage_upload").click(function () {
            manage_ctrl.uploadImage();
        });
        $("#manage_refresh").click(function () {
            manage_ctrl.refreshList();
        });
        /**
         * @TODO Add functionality to populate the filter menu with values taken from the controller?
         * At least get the code DRY somehow.
         */
        $("#manage_filter").change(function () {
            var value = $(this).value;
            manage_ctrl.filterImages(value);
        });
        $(".thumbs_img_container").click(function (element) {
            var id = $(this).attr('id');
            manage_ctrl.selectImage(id);
        });
    };
    tourModel = function () {
        var new_model = {},
            my = {
                active_room_id: null,
                generateImageID: function () {
                    var image_id = "image_" + my.id();
                    return image_id;
                },
                generateRoomID: function () {
                    var room_id = "room_" + my.id();
                    return room_id;
                },
                generateRoomViewID: function () {
                    var room_view_id = "room_view_" + my.id();
                    return room_view_id;
                },
                id_no: 0,
                id: function () {
                    my.id_no += 1;
                    return my.id_no;
                },
                images: {},
                rooms: {}
            };
        new_model.addImage = function (file_name) {
            var image_id = my.generateImageID();
            my.images[image_id] = {
                name: "New Image",
                file_name: file_name,
                uses_list: []
            }
        };
        new_model.addRoom = function () {
            var room_id = my.generateRoomID();
            my.rooms[room_id] = {
                name: "New Room",
                room_views: {},
            };
            new_model.addRoomView(room_id);
            if (my.rooms.length === 1) {
                my.active_room_id = room_id;
            }
        };
        new_model.addRoomView = function (room_id) {
            if (room_id === undefined) {
                room_id = my.active_room_id;
            }
            var room_view_id = my.generateRoomViewID();
            my.rooms[room_id].room_views[room_view_id] = {
                name: "New View",
                description: "New view of the room",
                src: "",
                shapes: [],
                id: room_view_id
            };
            return my.rooms[room_id].room_views[room_view_id];
        };
        new_model.getActiveRoomID = function () {
            return my.active_room_id;
        };
        new_model.getImage = function (image) {
            return my.images[image];
        };
        new_model.getImages = function () {
            return my.images;
        };
        new_model.getRoomView = function (room_view, room) {
            if (room !== undefined && my.rooms.hasOwnProperty(room) && my.rooms[room].room_views.hasOwnProperty) {
                return my.rooms[room].room_views[room_view];
            } else if (my.active_room_id !== null && my.rooms.hasOwnProperty(my.active_room_id) && my.rooms[my.active_room_id].room_views.hasOwnProperty(room_view)) {
                return my.rooms[my.active_room_id].room_views[room_view];
            }
            return null;
        };
        new_model.getRooms = function () {
            return my.rooms;
        };
        new_model.getRoom = function (room) {
            return my.rooms[room];
        };
        new_model.setActiveRoom = function (active_room_id) {
            my.active_room_id = active_room_id;
        };
        new_model.updateRoomView = function (room_view, room) {
            if (room !== undefined && my.rooms.hasOwnProperty(room) && my.rooms[room].room_views.hasOwnProperty) {
                my.rooms[room].room_views[room_view.id] = room_view;
            } else if (my.active_room_id !== null && my.rooms.hasOwnProperty(my.active_room_id) && my.rooms[my.active_room_id].room_views.hasOwnProperty(room_view)) {
                my.rooms[my.active_room_id].room_views[room_view.id] = room_view;
            }
        }
        return new_model;
    };

    $(document).ready(function () {
        var canvas_ctrl = drawCanvas(),
            model = tourModel(),
            edit_view = adminView(),
            manage_view = manageView(),
            manage_ctrl = manageControls(manage_view, canvas_ctrl, model),
            edit_ctrl = editControls(edit_view, canvas_ctrl, model);
        edit_view.setController(edit_ctrl);
        manage_view.setController(manage_ctrl);
        setDrawPanel(edit_ctrl);
        setManagePanel(manage_ctrl);
    });
}());
