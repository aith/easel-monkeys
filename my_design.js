/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

class Rect {
    // NOTE the vertices order
    constructor(scale_x, scale_y, color) {
        this.scale_x = scale_x
        this.scale_y = scale_y
        this.n_vertices = [[0, 0], [scale_x, 0]]
        this.e_vertices = [[scale_x-1, 0], [scale_x-1, scale_y-1]]
        this.s_vertices = [[scale_x-1, scale_y], [0, scale_y-1]]
        this.w_vertices = [[0,scale_y-1], [0,0]]
        this.color = color
    }
    all_vertices() {
        return this.n_vertices.concat(this.e_vertices, this.s_vertices, this.w_vertices);
    }
}


function p4_inspirations() {
    let imgs = [
        {
            name: "Nighthawks - Edward Hopper",
            assetUrl: "https://cdn.glitch.com/a9ccced7-5149-4223-becd-92be9a575a62%2Fnighthawks.jpg?v=1613688224211"
        }

    ];
    return imgs;
}

let height;
let width;
function p4_initialize(inspiration) {
    let scalar = 9
    width = inspiration.image.width / scalar
    height = inspiration.image.height / scalar
    resizeCanvas(width, height);

    debug(inspiration);

    print(height)
    print(width)
    return {};
}

function debug(inspiration) {
    let scalar = 2
    width = inspiration.image.width / scalar
    height = inspiration.image.height / scalar
    resizeCanvas(width, height);
    noLoop()
}


function draw_vertices(vertices) {
    noStroke()
    beginShape()
    for (let idx = 0; idx < vertices.length; idx++) {
        let pair = vertices[idx]
        vertex(pair[0], pair[1])
    }
    endShape(CLOSE)
}


function p4_render(design, inspiration) {
    background("white")
    fill("blue")
    let num_rects = 200;
    let subd_per_rect = 8;
    for(let idx = 0; idx < num_rects; idx++) {
        let rect_x = random(0, width)
        let rect_y = random(0, height)
        let rect_width = random(40, width - rect_x)  // TODO make these scale with image/canv
        let rect_height = random(40, height - rect_y)
        translate(rect_x, rect_y)
        let r = new Rect(rect_width, rect_height, color(random(100, 255), 122))
        subdivide_rect(r, subd_per_rect);
        fill(r.color)
        draw_vertices(r.all_vertices())
        translate(-rect_x, -rect_y)
    }
}

function subdivide_edge(vertices, amt, split_edge_func) {
    let result = vertices.slice();
    for(let sub_num = 0; sub_num < amt; sub_num++){
        let new_vertices = [];
        if(result.length > 0) {
            let additions = split_edge_func(result[0], result[1]);
            additions.forEach(v => { new_vertices.push(v) })
        };
        for(let idx = 1; idx < result.length-1; idx++) {
            let additions = split_edge_func(result[idx], result[idx+1]);
            new_vertices.push(additions[1], additions[2])
        }
        result = new_vertices;
    }
    return result;
}

function subdivide_rect(rect, amt) {
    rect.n_vertices = subdivide_edge(rect.n_vertices, 4, split_horizontal_edge)
    rect.e_vertices = subdivide_edge(rect.e_vertices, 4, split_vertical_edge)
    rect.s_vertices = subdivide_edge(rect.s_vertices, 4, split_horizontal_edge)
    rect.w_vertices = subdivide_edge(rect.w_vertices, 4, split_vertical_edge)
}

function split_horizontal_edge(vertex_1, vertex_2) {
    let offset = 5
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 | 0;
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 + random(-offset, offset)
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

function split_vertical_edge(vertex_1, vertex_2) {
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 + random(-5, 5)
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 | 0;
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

function p4_mutate(design, inspiration, rate) {
}
