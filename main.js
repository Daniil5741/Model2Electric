const CHARGE_LEFT = 10;
const CHARGE_RIGHT = -10;
const RADIUS = 5;
const DEFOLT_X_CHARGE_LEFT = 156;
const DEFOLT_Y_CHARGE_LEFT = 156;
const DEFOLT_X_CHARGE_RIGHT = 306;
const DEFOLT_Y_CHARGE_RIGHT = 156;
const DISTANCE = 150;
const HEIGHT_FRAME = 356;
const WIDTH_FRAME = 506;
const MINIMAL_LINES = 12;
const k = 9 * 1e9;
const PREV_X = 250;
const PREV_Y = 250;
var Charge_left = null;
var Charge_right = null;
var Charge_prev = 0;
var canvas = document.getElementById('window');
var main_Canvas = canvas.getContext('2d');
var distance = DISTANCE;
var DOT_X = 250;
var DOT_Y = 250;
var point = null;


var canvas1 = document.getElementById('canvas_left_charge');
var canvas_Charge_Left = canvas1.getContext('2d');
var canvas2 = document.getElementById('canvas_right_charge');
var canvas_Charge_Right = canvas2.getContext('2d');

var canvas3 = document.getElementById('graphic_potention');
var canvas_potension = canvas3.getContext('2d');

var canvas4 = document.getElementById('graphic_tension');
var canvas_tension = canvas4.getContext('2d');

var button_start = document.getElementById('start_button');
button_start.onclick = OnClickStart;

var button_calc = document.getElementById('calc_button');
button_calc.onclick = OnClickCalc;

var button_draw = document.getElementById('draw_button');
button_draw.onclick = OnClickDraw;

var ans_tension = document.getElementById('ans_tension');
var ans_potension = document.getElementById('ans_porension');

class Point {
    x = 250;
    y = 250;
    prevX = 250;
    prevY = 250;

    constructor(x, y, prevX, prevY) {
        this.x = x;
        this.y = y;
        this.prevX = prevX;
        this.prevY = prevY;

    }
}

class Charge {
    charge = 1;
    x = 156;
    y = 156;
    radius = 2;
    prevX = 156;
    prevY = 156;

    constructor(x, y, charge, radius) {
        this.x = x;
        this.y = y;
        this.charge = charge;
        this.radius = radius;
    }
}

Charge_left = new Charge(DEFOLT_X_CHARGE_LEFT, DEFOLT_Y_CHARGE_LEFT, CHARGE_LEFT, RADIUS);
Charge_right = new Charge(DEFOLT_X_CHARGE_RIGHT, DEFOLT_Y_CHARGE_RIGHT, CHARGE_RIGHT, RADIUS);
point = new Point(DOT_X, DOT_Y, PREV_X, PREV_Y);
window.onload = init;

function init() {

    input_charge_left = document.getElementById("edit_charge_left");
    input_charge_right = document.getElementById("edit_charge_right");
    input_distance = document.getElementById("edit_distance");
    input_PointX = document.getElementById("edit_pointX");
    input_PointY = document.getElementById("edit_pointY");

    input_charge_left.value = CHARGE_LEFT;
    input_charge_right.value = CHARGE_RIGHT;
    input_distance.value = DISTANCE;
    input_PointX.value = DOT_X;
    input_PointY.value = DOT_Y;

    document.getElementById("edit_charge_left").value = CHARGE_LEFT;
    document.getElementById("edit_charge_right").value = CHARGE_RIGHT;
    document.getElementById("edit_distance").value = DISTANCE;
    document.getElementById("edit_pointX").value = DOT_X;
    document.getElementById("edit_pointY").value = DOT_Y;

    input_PointX.addEventListener('change', (event) => {
        point.prevX = point.x;
        point.prevY = point.y;
        point.x = parseFloat(input_PointX.value);
    });
    input_PointY.addEventListener('change', (event) => {
        point.prevX = point.x;
        point.prevY = point.y;
        point.y = parseFloat(input_PointY.value);
    });
    input_charge_left.addEventListener('change', (event) => {
        Charge_prev = Charge_left.radius;
        Charge_left.charge = parseFloat(input_charge_left.value);
        redraw_Charge(Charge_left, Charge_prev);

    });
    input_charge_right.addEventListener('change', (event) => {
        Charge_prev = Charge_right.radius;
        Charge_right.charge = parseFloat(input_charge_right.value);
        redraw_Charge(Charge_right, Charge_prev);

    });
    input_distance.addEventListener('change', (event) => {
        let distance_prev = distance;
        distance = parseFloat(input_distance.value);
        let delta_distance = (distance - distance_prev) / 2;
        Charge_right.prevX = Charge_right.x;
        Charge_right.prevY = Charge_right.y;
        Charge_right.x = Charge_right.x + delta_distance;
        Charge_left.prevX = Charge_left.x;
        Charge_left.prevY = Charge_left.y;
        Charge_left.x = Charge_left.x - delta_distance;
        redraw_Charge(Charge_right, Charge_right.charge);
        redraw_Charge(Charge_left, Charge_left.charge);
    });
    draw_os_for_graphics();
    draw_Charge_Left();
    draw_Charge_Right();

    main_Canvas.stroke();


    alert("Здесь представлено моделирование Электростатического поля в которой находятся два заряда. " +
        "Кнопка 'Линии напряженности' означает,что вы хотите увиделть линии напряженности. " +
        "Кнопка 'Графики' означает, что вы хотите нарисовать графики напряженности и потенциала. " +
        "Кнопка 'Напряженность и потенциала в точке' означает, что вы хотите нарисовать найти " +
        "Напряженность и потенциала в  заданной точке. " +
        "Если вы нашли баги,то напишите мне на почту: 8spider-man@mail.ru. " +
        "Приятного экспериментирования!");
}


function draw_lines_of_force_for_left_different() {

    main_Canvas.strokeStyle = 'rgba(33,0,52,0.92)';
    main_Canvas.lineWidth = 0.3;
    let main_x;
    let d = 2 * Charge_left.radius;
    let delta = d / (MINIMAL_LINES);
    if (Math.abs(Charge_left.charge) > Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_left.charge) / Math.abs(Charge_right.charge) * MINIMAL_LINES);
        console.log('delta=' + delta);
    } else if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_left.charge) / Math.abs(Charge_right.charge) * MINIMAL_LINES);
        if (delta > 1) {
            delta = 1;
        }
    }
    for (let i = -Math.abs(Charge_left.radius) + 0.1; i <= Math.abs(Charge_left.radius); i += delta) {
        let alfa = Math.PI / 4;

        main_Canvas.beginPath();
        let y = i;
        let dx = 0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_left.radius);
        let x = -Math.sqrt(1 - y * y / (r * r)) * r;
        let x2 = x;
        let y2 = y;


        for (; x > -Charge_left.x + 6 || (x >
            WIDTH_FRAME);) {

            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));

            if (isNaN(dy) || dy == -Infinity) {
                break;
                main_Canvas.stroke();
            }

            if (dy > 0) {
                break;

            }
            if (Charge_left.x + x + dx > Charge_right.x - Math.abs(Charge_right.radius) && Charge_left.x +
                x + dx < Charge_right.x + Math.abs(Charge_right.radius)) {
                if ((y + dy) <= Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2)) &&
                    (y + dy) >= -Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2))) {

                    console.log("work");
                    break;
                } else {
                    break;
                }
            }
            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);

            x -= dx;
            y -= dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
        }
        main_Canvas.stroke();
        x = -Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x > -Charge_left.x + 6;) {

            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));


            if (dy < 0) {
                break;

            }

            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);

            x -= dx;
            y -= dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
        }
        main_Canvas.stroke();
    }
    for (let i = -Math.abs(Charge_left.radius) + 0.2; i <= Math.abs(Charge_left.radius); i += delta) {

        main_Canvas.beginPath();
        let y = i;
        let dx = 0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_left.radius);
        let x = Math.sqrt(1 - y * y / (r * r)) * r;
        let prev_dy = dy;

        for (; x <= l;) {
            console.log("x =" + x);
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))
            //  console.log("y =" + y);

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));
            console.log("dy =" + dy);
            console.log("dx =" + dx);

            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);

        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        let x_prev = x;
        let y_prev = y;
        for (; x < WIDTH_FRAME - Charge_left.x;) {
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))
            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));
            if (isNaN(dy) || dy == Infinity) {
                break;
                main_Canvas.stroke();
            }
            if (dy > 0) {

                break;

            }
            if (Math.abs(dy) > 5) {
                break;
            }
            if (Charge_left.x + x + dx > Charge_right.x - Math.abs(Charge_right.radius) && Charge_left.x +
                x + dx < Charge_right.x + Math.abs(Charge_right.radius)) {
                if ((y + dy) <= Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2)) &&
                    (y + dy) >= -Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2))) {
                    x += dx;
                    y += dy;
                } else {
                    main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
                    x += dx;
                    y += dy;
                    main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
                }
            } else {
                main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);

                x += dx;
                y += dy;
                main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
            }

        }
        main_Canvas.stroke();
        main_Canvas.beginPath();

        for (; x < WIDTH_FRAME - Charge_left.x;) {
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))
            //  console.log("y =" + y);
            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));

            if (dy < 0) {
                break;

            }
            if (Math.abs(dy) > 5) {
                break;
            }
            if (Charge_left.x + x + dx > Charge_right.x - Math.abs(Charge_right.radius) && Charge_left.x +
                x + dx < Charge_right.x + Math.abs(Charge_right.radius)) {
                if ((y + dy) <= Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2)) &&
                    (y + dy) >= -Math.sqrt(Math.pow(Math.abs(Charge_right.radius), 2) - Math.pow(Charge_right.x - (Charge_left.x + x + dx), 2))) {

                    x += dx;
                    y += dy;
                } else {
                    main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
                    x += dx;
                    y += dy;
                    main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
                }
            } else {
                main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
                x += dx;
                y += dy;
                main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
            }
        }
        main_Canvas.stroke();
    }

}

function draw_lines_of_force_for_right_different() {
    main_Canvas.strokeStyle = 'rgba(33,0,52,0.92)';
    main_Canvas.lineWidth = 0.4;
    let d = 2 * Charge_left.radius;
    let delta = d / (MINIMAL_LINES);
    if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        console.log('delta=' + delta);
    } else if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        if (delta > 1) {
            delta = 1;
        }
    }
    for (let i = -Math.abs(Charge_right.radius) + 0.2; i <= Math.abs(Charge_right.radius); i += delta) {
        main_Canvas.beginPath();
        let y = i;
        let dx = -0.05;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_right.radius);
        let x = -Math.sqrt(1 - y * y / (r * r)) * r;

        for (; x > -l;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))
            //   console.log("y =" + y);
            dy = -dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) - (q2 * Math.abs(x) / Math.pow(r2, 3))));

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y - y);

            x += dx;
            y -= dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y - y);
        }
        main_Canvas.stroke();
        main_Canvas.beginPath();

        for (; x > -Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))
            dy = -dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (-q1 * Math.abs(l + x) / Math.pow(r1, 3) - (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy < 0) {

                break;
            }
            if (Math.abs(dy) > 5) {
                break;
            }
            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y - y);
            x += dx;
            y -= dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y - y);
        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        for (; x > -Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = -dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (-q1 * Math.abs(l + x) / Math.pow(r1, 3) - (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy > 0) {
                break;
            }
            if (Math.abs(dy) > 5) {
                break;
            }
            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y - y);

            x += dx;
            y -= dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y - y);
        }
        main_Canvas.stroke();
    }
    for (let i = -Math.abs(Charge_right.radius) + 0.1; i <= Math.abs(Charge_right.radius); i += delta) {
        main_Canvas.beginPath();
        let y = i;
        let dx = 0.05;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_right.radius);
        let x = Math.sqrt(1 - y * y / (r * r)) * r;


        for (; x < WIDTH_FRAME - Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) + (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy < 0) {

                break;
            }
            if (Charge_right.y + y + dy > HEIGHT_FRAME - 6) {
                break;
            }

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y + y);

            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y + y);
        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        x = Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x < WIDTH_FRAME - Charge_right.x;) {
            //    console.log("x =" + x);
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) + (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy > 0) {

                break;
            }

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y + y);

            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y + y);
        }
        main_Canvas.stroke();
    }

}


function draw_lines_of_force_for_right() {
    main_Canvas.strokeStyle = 'rgba(33,0,52,0.92)';
    main_Canvas.lineWidth = 0.4;
    let d = 2 * Charge_left.radius;
    let delta = d / (MINIMAL_LINES);
    if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        console.log('delta=' + delta);
    } else if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        if (delta > 1) {
            delta = 1;
        }
    }
    for (let i = -Math.abs(Charge_right.radius) + 0.1; i <= Math.abs(Charge_right.radius); i += delta) {
        main_Canvas.beginPath();
        let y = i;
        let dx = -0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_right.radius);
        let x = -Math.sqrt(1 - y * y / (r * r)) * r;


        for (; x > -Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = -dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) - (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy > 0) {
                break;
            }
            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y - y);

            x += dx;
            y -= dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y - y);
        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        x = -Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x > -Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = -dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) - (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy < 0) {
                break;
                main_Canvas.stroke();
            }

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y - y);

            x += dx;
            y -= dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y - y);
        }
        main_Canvas.stroke();

    }


    for (let i = -Math.abs(Charge_right.radius) + 0.1; i <= Math.abs(Charge_right.radius); i += delta) {

        main_Canvas.beginPath();
        let y = i;
        let dx = 0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_right.radius);

        let x = Math.sqrt(1 - y * y / (r * r)) * r;


        for (; x < WIDTH_FRAME - Charge_right.x;) {

            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))
            //   console.log("y =" + y);
            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) + (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy < 0) {
                break;
            }

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y + y);

            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y + y);
        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        x = Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x < WIDTH_FRAME - Charge_right.x;) {
            r2 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r1 = Math.sqrt(Math.pow(-l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                (q1 * Math.abs(l + x) / Math.pow(r1, 3) + (q2 * Math.abs(x) / Math.pow(r2, 3))));

            if (dy > 0) {
                break;
            }

            main_Canvas.moveTo(Charge_right.x + x, Charge_right.y + y);

            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_right.x + x, Charge_right.y + y);
        }
        main_Canvas.stroke();

    }
}

function draw_lines_of_force_for_left() {
    main_Canvas.strokeStyle = 'rgba(33,0,52,0.92)';
    main_Canvas.lineWidth = 0.4;
    let d = 2 * Charge_left.radius;
    let delta = d / (MINIMAL_LINES);
    if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        console.log('delta=' + delta);
    } else if (Math.abs(Charge_left.charge) < Math.abs(Charge_right.charge)) {
        delta = d / (Math.abs(Charge_right.charge) / Math.abs(Charge_left.charge) * MINIMAL_LINES);
        if (delta > 1) {
            delta = 1;
        }
    }
    for (let i = -Math.abs(Charge_left.radius) + 0.1; i <= Math.abs(Charge_left.radius); i += delta) {
        main_Canvas.beginPath();
        let y = i;
        let dx = 0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Charge_left.radius;
        let x = -Math.sqrt(1 - y * y / (r * r)) * r;

        for (; x > -Charge_left.x;) {
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));

            if (isNaN(dy) || dy == -Infinity) {
                break;
                main_Canvas.stroke();
            }

            if (dy > 0) {
                break;
                main_Canvas.stroke();
            }

            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);

            x -= dx;
            y -= dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
        }
        x = -Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x > -Charge_left.x;) {

            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));

            if (dy < 0) {
                break;
                main_Canvas.stroke();
            }

            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
            x -= dx;
            y -= dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);
        }
        main_Canvas.stroke();
    }
    for (let i = -Math.abs(Charge_left.radius) + 0.1; i <= Math.abs(Charge_left.radius); i += delta) {

        main_Canvas.beginPath();
        let y = i;
        let dx = 0.4;
        let dy = 0;
        let r1 = 0;
        let r2 = 0;
        let q1 = Charge_left.charge;
        let q2 = Charge_right.charge;
        let l = distance;
        let r = Math.abs(Charge_left.radius);

        let x = Math.sqrt(1 - y * y / (r * r)) * r;
        let prev_dy = dy;

        for (; x <= WIDTH_FRAME;) {
            console.log("x =" + x);
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))

            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));
            console.log("dy =" + dy);
            console.log("dx =" + dx);

            if (dy > 0) {
                break;
                main_Canvas.stroke();
            }

            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);

            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);

        }
        main_Canvas.stroke();
        main_Canvas.beginPath();
        x = Math.sqrt(1 - y * y / (r * r)) * r;
        for (; x <= WIDTH_FRAME;) {
            console.log("x =" + x);
            r1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            r2 = Math.sqrt(Math.pow(l - x, 2) + Math.pow(y, 2))


            dy = dx * (((q1 * y) / Math.pow(r1, 3) + (q2 * y) / Math.pow(r2, 3)) /
                ((q1 * x) / Math.pow(r1, 3) - (q2 * (l - x) / Math.pow(r2, 3))));

            if (dy < 0) {
                break;
                main_Canvas.stroke();
            }


            main_Canvas.moveTo(Charge_left.x + x, Charge_left.y - y);
            x += dx;
            y += dy;
            main_Canvas.lineTo(Charge_left.x + x, Charge_left.y - y);

        }
        main_Canvas.stroke();

    }
}


function redraw_Charge(charge, prev) {

    if (prev <= charge.charge) {
        main_Canvas.lineWidth = 3;
        main_Canvas.beginPath();
        main_Canvas.strokeStyle = 'rgba(255,255,255,1)';
        main_Canvas.arc(charge.prevX, charge.prevY, charge.radius,
            0, 2 * Math.PI);
        main_Canvas.fillStyle = 'rgba(255,255,255,1)';
        main_Canvas.fill();
        main_Canvas.stroke();
        console.log("Up ");

    } else {
        main_Canvas.lineWidth = 3;
        main_Canvas.beginPath();

        main_Canvas.strokeStyle = 'rgba(255,255,255,1)';
        main_Canvas.arc(charge.prevX, charge.prevY, charge.radius,
            0, 2 * Math.PI);
        main_Canvas.fillStyle = 'rgba(255,255,255,1)';
        main_Canvas.fill();
        main_Canvas.stroke();
        console.log("Down ");
    }
    main_Canvas.beginPath();
    main_Canvas.lineWidth = 1;
    if (charge.charge > 0)
        main_Canvas.strokeStyle = 'rgba(255,0,12,0.92)';
    if (charge.charge < 0)
        main_Canvas.strokeStyle = 'rgba(0,26,249,0.92)';

    main_Canvas.arc(charge.x, charge.y, charge.radius,
        0, 2 * Math.PI);

    main_Canvas.stroke();
    Charge_right.prevX = Charge_right.x;
    Charge_right.prevY = Charge_right.y;
    Charge_left.prevX = Charge_left.x;
    Charge_left.prevY = Charge_left.y;
    main_Canvas.beginPath();
    main_Canvas.lineWidth = 1;
    if (charge.charge > 0)
        main_Canvas.strokeStyle = 'rgba(255,0,12,0.92)';
    if (charge.charge < 0)
        main_Canvas.strokeStyle = 'rgba(0,26,249,0.92)';

    if (charge.charge >= 0) {
        main_Canvas.moveTo(charge.x - Math.abs(charge.radius), charge.y);
        main_Canvas.lineTo(charge.x + Math.abs(charge.radius), charge.y);
        main_Canvas.moveTo(charge.x, charge.y - Math.abs(charge.radius));
        main_Canvas.lineTo(charge.x, charge.y + Math.abs(charge.radius));
    } else {
        main_Canvas.moveTo(charge.x - Math.abs(charge.radius), charge.y);
        main_Canvas.lineTo(charge.x + Math.abs(charge.radius), charge.y);
    }

    main_Canvas.stroke();
}

function draw_Charge_Left() {
    main_Canvas.beginPath();
    main_Canvas.strokeStyle = 'rgba(255,0,12,0.92)';
    main_Canvas.arc(DEFOLT_X_CHARGE_LEFT, DEFOLT_Y_CHARGE_LEFT,
        Math.abs(Charge_left.radius), 0, 2 * Math.PI);

    main_Canvas.lineWidth = 1;
    main_Canvas.moveTo(DEFOLT_X_CHARGE_LEFT - Math.abs(Charge_left.radius) + 1, DEFOLT_Y_CHARGE_LEFT);
    main_Canvas.lineTo(DEFOLT_X_CHARGE_LEFT + Math.abs(Charge_left.radius) - 1, DEFOLT_Y_CHARGE_LEFT);
    main_Canvas.moveTo(DEFOLT_X_CHARGE_LEFT, DEFOLT_Y_CHARGE_LEFT - Math.abs(Charge_left.radius));
    main_Canvas.lineTo(DEFOLT_X_CHARGE_LEFT, DEFOLT_Y_CHARGE_LEFT + Math.abs(Charge_left.radius));
    main_Canvas.stroke();
}

function draw_Charge_Right() {
    main_Canvas.beginPath();
    main_Canvas.strokeStyle = ' rgba(0,26,249,0.92)';

    main_Canvas.arc(DEFOLT_X_CHARGE_RIGHT, DEFOLT_Y_CHARGE_RIGHT,
        Math.abs(Charge_right.radius), 0, 2 * Math.PI);
    main_Canvas.stroke();
    main_Canvas.beginPath();
    main_Canvas.lineWidth = 0.7;
    main_Canvas.moveTo(DEFOLT_X_CHARGE_RIGHT - Math.abs(Charge_right.radius) + 1, DEFOLT_Y_CHARGE_RIGHT);
    main_Canvas.lineTo(DEFOLT_X_CHARGE_RIGHT + Math.abs(Charge_right.radius) - 1, DEFOLT_Y_CHARGE_RIGHT);
    main_Canvas.stroke();
}

function OnClickStart() {

    document.getElementById("text_on_window").classList.remove("hide");
    setTimeout(draw_on_click, 10);


}

function draw_on_click() {
    main_Canvas.clearRect(0, 0, WIDTH_FRAME, HEIGHT_FRAME);
    if ((Charge_left.charge > 0 && Charge_right.charge < 0) ||
        (Charge_left.charge < 0 && Charge_right.charge > 0)) {
        if (Charge_left.charge > 0) {
            draw_lines_of_force_for_left_different();
        }
        if (Charge_right.charge > 0) {
            draw_lines_of_force_for_right_different();
        }

    } else {
        draw_lines_of_force_for_left();
        draw_lines_of_force_for_right();
    }
    redraw_Charge(Charge_right, Charge_right.radius);
    redraw_Charge(Charge_left, Charge_left.radius);

    main_Canvas.fillText("x", canvas.width - 15, 20);
    main_Canvas.fillText("y", 15, canvas.height - 10);
    document.getElementById("text_on_window").classList.add("hide");
    draw_os_for_main_canvas();
}

function OnClickCalc() {
    main_Canvas.transform(1, 0, 0, -1, 0, canvas.height);
    console.log("prevX=" + point.prevX + " prevY=" + point.prevY);
    main_Canvas.beginPath();
    main_Canvas.strokeStyle = 'rgba(255,255,255,1)';
    main_Canvas.arc(point.prevX + 6, point.prevY + 6, 7, 0, 2 * Math.PI);
    main_Canvas.fillStyle = 'rgba(255,255,255,1)';
    main_Canvas.fill();
    main_Canvas.stroke();
    main_Canvas.beginPath();
    main_Canvas.strokeStyle = 'rgba(242,255,0,0.92)';
    main_Canvas.arc(point.x + 6, point.y + 6, 4, 0, 2 * Math.PI);
    main_Canvas.fillStyle = 'rgba(242,255,0,0.92)';
    main_Canvas.fill();
    main_Canvas.stroke();
    main_Canvas.resetTransform();
    var a = Math.sqrt(Math.pow(point.x - Charge_left.x, 2) + Math.pow(point.y - Charge_left.y, 2));
    var b = Math.sqrt(Math.pow(point.x - Charge_right.x, 2) + Math.pow(point.y - Charge_right.y, 2));
    let E1 = Charge_left.charge * k / (a * a);
    let E2 = Charge_left.charge * k / (b * b);
    if (Charge_left.charge > 0 && Charge_right.charge < 0) {

        var r = distance;
        var cos_b = (a * a + r * r - b * b) / (2 * a * r);
        var cos_y = (b * b + r * r - a * a) / (2 * b * r);
        var alfa = Math.acos(cos_b) + Math.acos(cos_y);
        var E = Math.sqrt(E1 * E1 + E2 * E2 - 2 * E1 * E2 * Math.cos(alfa));
        console.log("a=" + a + " b= " + b + " r =" + r);
        console.log("cos b=" + cos_b + " cos_y= " + cos_y + " alfa =" + alfa);
        document.getElementById('ans_tension').innerHTML = E.toFixed(2);

        let fi1 = k * Charge_left.charge / a;
        let fi2 = k * Charge_right.charge / b;
        let fi = fi1 + fi2;
        document.getElementById('ans_potensial').innerHTML = fi.toFixed(2);
    }
    if (Charge_left.charge < 0 && Charge_right.charge < 0) {

        var r = distance;
        var cos_b = (a * a + r * r - b * b) / (2 * a * r);
        var cos_y = (b * b + r * r - a * a) / (2 * b * r);
        var alfa = Math.acos(cos_b) + Math.acos(cos_y);
        var E = Math.sqrt(E1 * E1 + E2 * E2 - 2 * E1 * E2 * Math.cos(alfa));
        console.log("a=" + a + " b= " + b + " r =" + r);
        console.log("cos b=" + cos_b + " cos_y= " + cos_y + " alfa =" + alfa);
        document.getElementById('ans_tension').innerHTML = E.toFixed(2);

        let fi1 = k * Charge_left.charge / a;
        let fi2 = k * Charge_right.charge / b;
        let fi = fi1 + fi2;
        document.getElementById('ans_potensial').innerHTML = fi.toFixed(2);
    }
    if (Charge_left.charge > 0 && Charge_right.charge > 0) {

        var r = distance;
        var cos_b = (a * a + r * r - b * b) / (2 * a * r);
        var cos_y = (b * b + r * r - a * a) / (2 * b * r);
        var alfa = Math.acos(cos_b) + Math.acos(cos_y);
        var E = Math.sqrt(E1 * E1 + E2 * E2 - 2 * E1 * E2 * Math.cos(alfa));
        console.log("a=" + a + " b= " + b + " r =" + r);
        console.log("cos b=" + cos_b + " cos_y= " + cos_y + " alfa =" + alfa);
        document.getElementById('ans_tension').innerHTML = E.toFixed(2);

        let fi1 = k * Charge_left.charge / a;
        let fi2 = k * Charge_right.charge / b;
        let fi = fi1 + fi2;
        document.getElementById('ans_potensial').innerHTML = fi.toFixed(2);
    }
    if (Charge_left.charge < 0 && Charge_right.charge > 0) {

        var r = distance;
        var cos_b = (a * a + r * r - b * b) / (2 * a * r);
        var cos_y = (b * b + r * r - a * a) / (2 * b * r);
        var alfa = Math.acos(cos_b) + Math.acos(cos_y);
        var E = Math.sqrt(E1 * E1 + E2 * E2 - 2 * E1 * E2 * Math.cos(alfa));
        console.log("a=" + a + " b= " + b + " r =" + r);
        console.log("cos b=" + cos_b + " cos_y= " + cos_y + " alfa =" + alfa);
        document.getElementById('ans_tension').innerHTML = E.toFixed(2);

        let fi1 = k * Charge_left.charge / a;
        let fi2 = k * Charge_right.charge / b;
        let fi = fi1 + fi2;
        document.getElementById('ans_potensial').innerHTML = fi.toFixed(2);
    }
}

function maximum(array) {
    let max = -1e12;
    for (let i = 0; i < array.length; i++) {
        if (max < array[i] && array[i] != Infinity) {
            max = array[i];

        }
    }
    return max;
}

function minimum(array) {
    let min = 1e12;
    for (let i = 0; i < array.length; i++) {
        if (min > array[i] && array[i] != -Infinity) {
            min = array[i];
        }
    }
    return min;
}

function OnClickDraw() {

    canvas_tension.clearRect(0, 0, 506, 306);
    canvas_potension.clearRect(0, 0, 506, 306);
    draw_os_for_graphics();


    draw_graphycs_potension();
    draw_graphycs_tension();
}

function draw_graphycs_potension() {
    canvas_potension.transform(1, 0, 0, -1, 0, canvas3.height);
    var a = Math.abs(Charge_left.x);
    var b = Math.abs(Charge_right.x);
    let fi1 = k * Charge_left.charge / a / 1e8;
    let fi2 = k * Charge_right.charge / b / 1e8;
    var result_for_potension = [];
    result_for_potension[0] = fi1 + fi2 + 6;
    var i = 1;
    for (let x = 1; x < 499; x += 1) {
        a = Math.abs(Charge_left.x - x);
        b = Math.abs(Charge_right.x - x);
        fi1 = k * Charge_left.charge / a / 1e8;
        fi2 = k * Charge_right.charge / b / 1e8;
        result_for_potension[x] = fi1 + fi2 + 6;
        console.log(result_for_potension[x]);

        console.log("a= " + a + "b= " + b + "fi1=" + fi1 + "fi2= " + fi2);
    }
    max = maximum(result_for_potension);
    min = minimum(result_for_potension);
    console.log("max=" + max + "min=" + min + "array_size=" + result_for_potension.length);
    canvas_potension.beginPath();
    let j = 0;
    for (let x = 0; x < 499; x++) {

        if (result_for_potension[x] != Infinity && result_for_potension[x] != -Infinity) {
            if (result_for_potension[x] >= 0) {
                canvas_potension.moveTo(x + 6, 150 + result_for_potension[x] / max * 140);
                canvas_potension.lineTo(x + 6, 150 + result_for_potension[x + 1] / max * 140);
            } else {
                canvas_potension.moveTo(x + 6, 150 - result_for_potension[x] / min * 140);
                canvas_potension.lineTo(x + 6, 150 - result_for_potension[x + 1] / min * 140);
            }
        }

    }
    canvas_potension.moveTo(1, 290);
    canvas_potension.lineTo(10, 290);
    canvas_potension.moveTo(1, 17);
    canvas_potension.lineTo(10, 17);
    canvas_potension.moveTo(Charge_left.x + 6, 145);
    canvas_potension.lineTo(Charge_left.x + 6, 155);
    canvas_potension.moveTo(Charge_right.x + 6, 145);
    canvas_potension.lineTo(Charge_right.x + 6, 155);
    canvas_potension.stroke();
    canvas_potension.resetTransform();
    max = Math.round(max);
    canvas_potension.fillText(max.toString(), 12, 22);
    min = Math.round(min);
    canvas_potension.fillText(min.toString(), 12, 290);
    canvas_potension.fillText((Charge_left.x - 6).toString(), Charge_left.x - 2, 147);
    canvas_potension.fillText((Charge_right.x - 6).toString(), Charge_right.x, 147);
}

function draw_graphycs_tension() {
    canvas_tension.transform(1, 0, 0, -1, 0, canvas4.height);
    var a = Math.abs(Charge_left.x);
    var b = Math.abs(Charge_right.x);
    let e1 = k * Charge_left.charge / (a * a) / 1e8;
    let e2 = k * Charge_right.charge / (b * b) / 1e8;
    var result_for_tension = [];
    result_for_tension[0] = e1 + e2 + 6;
    var i = 1;
    for (let x = 1; x < 499; x += 1) {
        a = Math.abs(Charge_left.x - x);
        b = Math.abs(Charge_right.x - x);

        e1 = k * Charge_left.charge / (a * a) / 1e8;
        e2 = k * Charge_right.charge / (b * b) / 1e8;
        result_for_tension[x] = e1 + e2 + 6;
        console.log(result_for_tension[x]);

        console.log("a= " + a + "b= " + b + "e1=" + e1 + "e2= " + e2);
    }
    max = maximum(result_for_tension);
    min = minimum(result_for_tension);
    console.log("max=" + max + "min=" + min + "array_size=" + result_for_tension.length);
    canvas_tension.beginPath();
    let j = 0;
    for (let x = 0; x < 499; x++) {

        if (result_for_tension[x] != Infinity && result_for_tension[x] != -Infinity) {
            if (result_for_tension[x] >= 0) {
                canvas_tension.moveTo(x + 6, 150 + result_for_tension[x] / max * 140);
                canvas_tension.lineTo(x + 6, 150 + result_for_tension[x + 1] / max * 140);
            } else {
                canvas_tension.moveTo(x + 6, 150 - result_for_tension[x] / min * 140);
                canvas_tension.lineTo(x + 6, 150 - result_for_tension[x + 1] / min * 140);
            }
        }

    }
    canvas_tension.moveTo(1, 290);
    canvas_tension.lineTo(10, 290);
    canvas_tension.moveTo(1, 17);
    canvas_tension.lineTo(10, 17);
    canvas_tension.moveTo(Charge_left.x + 6, 145);
    canvas_tension.lineTo(Charge_left.x + 6, 155);
    canvas_tension.moveTo(Charge_right.x + 6, 145);
    canvas_tension.lineTo(Charge_right.x + 6, 155);
    canvas_tension.stroke();
    canvas_tension.resetTransform();
    max = Math.round(max);
    canvas_tension.fillText(max.toString(), 12, 22);
    min = Math.round(min);
    canvas_tension.fillText(min.toString(), 12, 290);
    canvas_tension.fillText((Charge_left.x - 6).toString(), Charge_left.x - 2, 147);
    canvas_tension.fillText((Charge_right.x - 6).toString(), Charge_right.x, 147);
}

function draw_os_for_graphics() {

    canvas_potension.transform(1, 0, 0, -1, 0, canvas3.height);
    canvas_potension.beginPath();
    canvas_potension.moveTo(5, 5);
    canvas_potension.lineTo(5, canvas3.height - 5);
    canvas_potension.moveTo(5, canvas3.height - 5);
    canvas_potension.lineTo(0, canvas3.height - 14);
    canvas_potension.moveTo(5, canvas3.height - 5);
    canvas_potension.lineTo(10, canvas3.height - 14);
    // canvas_potension.strokeText("10^8 ф", 13, canvas3.height - 10, 25);
    canvas_potension.moveTo(5, 150);
    canvas_potension.lineTo(canvas3.width - 5, 150);
    canvas_potension.moveTo(canvas3.width - 5, 150);
    canvas_potension.lineTo(canvas3.width - 10, 145);
    canvas_potension.moveTo(canvas3.width - 5, 150);
    canvas_potension.lineTo(canvas3.width - 10, 155);

    canvas_potension.stroke();
    canvas_tension.transform(1, 0, 0, -1, 0, canvas4.height);
    canvas_tension.beginPath();
    canvas_tension.moveTo(5, 5);
    canvas_tension.lineTo(5, canvas4.height - 5);
    canvas_tension.moveTo(5, canvas4.height - 5);
    canvas_tension.lineTo(0, canvas4.height - 14);
    canvas_tension.moveTo(5, canvas4.height - 5);
    canvas_tension.lineTo(10, canvas4.height - 14);

    canvas_tension.moveTo(5, 150);
    canvas_tension.lineTo(canvas4.width - 5, 150);
    canvas_tension.moveTo(canvas4.width - 5, 150);
    canvas_tension.lineTo(canvas4.width - 10, 145);
    canvas_tension.moveTo(canvas4.width - 5, 150);
    canvas_tension.lineTo(canvas4.width - 10, 155);

    canvas_tension.stroke();


    canvas_potension.resetTransform();
    canvas_potension.strokeText("10^8 ф", 13, 12, 25);
    canvas_potension.strokeText("x см", canvas3.width - 20, 146, 20);

    canvas_tension.resetTransform();
    canvas_tension.strokeText("10^8 E", 13, 12, 25);
    canvas_tension.strokeText("x см", canvas4.width - 20, 146, 20);
    draw_os_for_main_canvas();
}

function draw_os_for_main_canvas() {

    main_Canvas.transform(1, 0, 0, -1, 0, canvas.height);
    main_Canvas.strokeStyle = 'rgba(0,0,0,0.93)';
    main_Canvas.beginPath();
    main_Canvas.moveTo(5, 5);
    main_Canvas.lineTo(5, canvas.height - 5);
    main_Canvas.moveTo(5, canvas.height - 5);
    main_Canvas.lineTo(0, canvas.height - 10);
    main_Canvas.moveTo(5, canvas.height - 5);
    main_Canvas.lineTo(10, canvas.height - 10);
    main_Canvas.moveTo(5, 5);
    main_Canvas.lineTo(canvas.width - 5, 5);
    main_Canvas.moveTo(canvas.width - 5, 5);
    main_Canvas.lineTo(canvas.width - 10, 0);
    main_Canvas.moveTo(canvas.width - 5, 5);
    main_Canvas.lineTo(canvas.width - 10, 10);
    main_Canvas.moveTo(106, 12);
    main_Canvas.lineTo(106, 0);
    main_Canvas.moveTo(256, 12);
    main_Canvas.lineTo(256, 0);
    main_Canvas.moveTo(356, 12);
    main_Canvas.lineTo(356, 0);
    main_Canvas.moveTo(456, 12);
    main_Canvas.lineTo(456, 0);

    main_Canvas.moveTo(12, 106);
    main_Canvas.lineTo(0, 106);
    main_Canvas.moveTo(12, 206);
    main_Canvas.lineTo(0, 206);
    main_Canvas.moveTo(12, 306);
    main_Canvas.lineTo(0, 306);

    main_Canvas.strokeText("x", canvas.width - 15, 20);


    main_Canvas.stroke();

    main_Canvas.resetTransform();
    main_Canvas.strokeText("y", 15, 15);
    main_Canvas.strokeText("100", 100, 334);
    main_Canvas.strokeText("250", 250, 334);
    main_Canvas.strokeText("350", 350, 334);
    main_Canvas.strokeText("450", 450, 334);
    main_Canvas.strokeText("100", 15, 246);
    main_Canvas.strokeText("200", 15, 146);
    main_Canvas.strokeText("300", 15, 46);
}


