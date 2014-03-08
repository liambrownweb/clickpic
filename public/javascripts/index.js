(function () {
    'use strict';
    var editControls, drawCanvas, setDrawPanel;
    editControls = function (canvasctrl) {
        if (canvasctrl === undefined) {
            canvasctrl = drawCanvas();
        }
        var modes = canvasctrl.getModes(),
            self = {};
        self.setMode = function (mode) {
            canvasctrl.setMode(modes[mode]);
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
                TESTING: 4,
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
                edge_threshold: 8,
            },
            parts = {
                TOP: 1,
                TOPRIGHT: 4,
                RIGHT: 3,
                BOTTOMRIGHT: 8,
                BOTTOM: 5,
                BOTTOMLEFT: 14,
                LEFT: 9,
                TOPLEFT: 10,
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
                10: 'nw-resize',
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
            } else if (my.mode === modes.DRAWING) {
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
        }
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
        return self;
    };
    setDrawPanel = function (edit_ctrl) {
        if (edit_ctrl === undefined) {
            edit_ctrl = editControls();
        }
        $("#app_tabs").tabs();
        $("#edit_screen_list").accordion({heightStyle: "auto"});
        $("#add_room").button();
        $("#add_picture").button();
        $("#edit_tools").accordion({heightStyle: "fill"});
        $("#edit_mode").buttonset();
        $("#edit_mode").children("input").click(function (e) {
            edit_ctrl.setMode(e.currentTarget.value);
        });
    };

    $(document).ready(function () {
        var canvas_ctrl = drawCanvas(),
            edit_ctrl = editControls(canvas_ctrl);
        setDrawPanel(edit_ctrl);
    });
}());
