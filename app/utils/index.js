/**
 * Created by kylechen on 17-5-30.
 */


function m2s(minutes) {
    let flag = (minutes < 0);
    if(minutes < 0)
        minutes = -minutes;
    let h = parseInt(minutes / 60, 10);
    let m = parseInt(minutes % 60, 10);
    return (flag ? '-' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function s2m(s) {
    let h = parseInt(s.split(':')[0], 10);
    let m = parseInt(s.split(':')[1], 10);
    if(h < 0)m = -m;
    return h * 60 + m;
}

export default {
    m2s,
    s2m
}
