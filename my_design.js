/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
// todo
// - number form

class Rect {
    // NOTE the vertices order
    constructor(scale_x, scale_y, r, g, b, a, x, y) {
        this.scale_x = scale_x
        this.scale_y = scale_y
        this.n_vertices = [[0, 0], [scale_x, 0]]
        this.e_vertices = [[scale_x, 0], [scale_x, scale_y]]
        this.s_vertices = [[scale_x, scale_y], [0, scale_y]]
        this.w_vertices = [[0,scale_y], [0,0]]
        this.r = r
        this.g = g
        this.b = b
        this.a = a
        this.x = x
        this.y = y
    }
    all_vertices() {
        return this.n_vertices.concat(this.e_vertices, this.s_vertices, this.w_vertices);
    }
}


function p4_inspirations() {
    let imgs = [
        {
            name: "Bold and Brash - Unknown",
            assetUrl: "img/bandb.jpeg"
        },
        {
            name: "Starry Night - Vincent Van Gogh",
            assetUrl: "img/starrynight.jpeg"
        },
        {
            name: "Mona Lisa - Leonardo Da Vinci",
            assetUrl: "img/monalisa.jpeg"
        },
        {
            name: "Nighthawks - Edward Hopper",
            assetUrl: "img/starrynight.jpeg"
        }
    ];
    return imgs;
}

let can_height;
let can_width;
let seed;
let subdivision_offset;
function p4_initialize(inspiration) {
    seed = Math.random() * 1000
    randomSeed(seed)
    print(seed)

    let scalar = 2
    can_width = inspiration.image.width / scalar
    can_height = inspiration.image.height / scalar
    resizeCanvas(can_width, can_height);
    subdivision_offset = max(can_width, can_height) / 200;
    generateRects()

    // debug(inspiration);

    let bgColor = [122,122,122]
    return { rects: rects, bgColor: bgColor};
}

function regenerateRects(num) {
    reseed();
    generateRects(num)
}

function reseed() {
    seed += random(0, 1) + 15 * random(0, 1 );
    randomSeed(seed)
}

function debug(inspiration) {
    let scalar = 2
    can_width = inspiration.image.width / scalar
    can_height = inspiration.image.height / scalar
    resizeCanvas(can_width, can_height);
    subdivision_offset = max(can_width, can_height) / 200;
    // noLoop()
    frameRate(60)
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

let rects = []
function generateRects(n = 120) {
    rects = []
    let num_rects = n;

    let subd_per_rect= 3;
    let max_width = min(can_width, can_height) / 3;
    let max_height = min(can_width, can_height) / 3;
    let min_width = min(can_width, can_height) / 10;
    let min_height = min(can_width, can_height) / 10;

    let fixed_height = min(can_width, can_height) / 9;
    let fixed_width = min(can_width, can_height) / 9;
    let subd_per_rect_fixed = 0;

    let numPerRow = can_width / fixed_width;
    let numPerCol = can_height / fixed_height;

    if(filterType == "Watercoloured"){
        for(let idx = 0; idx < num_rects; idx++) {
            let rect_width = random(min_width, max_width)  // TODO make these scale with image/canv
            let rect_height = random(min_height, max_height)
            let rect_x = random(-rect_width/2, can_width - rect_width/2)
            let rect_y = random(-rect_height/2, can_height - rect_height/2)  // the /2 to let them bleed out
            let rgb = random(100, 255)
            let a = 125
            let r = new Rect(rect_width, rect_height, rgb, rgb, rgb, a, rect_x, rect_y)
            subdivide_rect(r, subd_per_rect);
            rects.push(r)
        }
    }
    else if(filterType == "Pixelated")
    {
        for(let x = 0; x < numPerRow; x++) {
            for(let y = 0; y < numPerCol; y++) {
                let rect_width = fixed_width  // TODO make these scale with image/canv
                let rect_height = fixed_height
                let rect_x = fixed_width * x;
                let rect_y = fixed_height * y;
                let rgb = random(100, 255)
                let a = 125
                let r = new Rect(rect_width, rect_height, rgb, rgb, rgb, a, rect_x, rect_y)
                subdivide_rect(r, subd_per_rect_fixed);
                rects.push(r)
            }
        }
    }
}


function p4_render(design, inspiration) {
    background(design["bgColor"])
    let rectsArr = design["rects"]
    for(let idx = 0; idx < rectsArr.length; idx++) {
        let r = rectsArr[idx]
        fill(color(r.r, r.g, r.b, r.a))
        translate(r.x, r.y)
        let all_vertices = r.n_vertices.concat(r.e_vertices, r.s_vertices, r.w_vertices);
        draw_vertices(all_vertices)
        translate(-r.x, -r.y)
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
    rect.n_vertices = subdivide_edge(rect.n_vertices, amt, split_horizontal_edge)
    rect.e_vertices = subdivide_edge(rect.e_vertices, amt, split_vertical_edge)
    rect.s_vertices = subdivide_edge(rect.s_vertices, amt, split_horizontal_edge)
    rect.w_vertices = subdivide_edge(rect.w_vertices, amt, split_vertical_edge)
}

function split_horizontal_edge(vertex_1, vertex_2) {
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 | 0;
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 + random(-subdivision_offset, subdivision_offset)
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

function split_vertical_edge(vertex_1, vertex_2) {
    let offset = can_height/200;
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 + random(-subdivision_offset, subdivision_offset)
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 | 0;
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

let last_colors_tested;
function p4_mutate(design, inspiration, rate) {
    let rectArray = design["rects"];
    let step = 3;
    design["bgColor"][0] += rate * randomGaussian(0, step);
    design["bgColor"][1] += rate * randomGaussian(0, step);
    design["bgColor"][2] += rate * randomGaussian(0, step);
    for(rect of rectArray) {
        [rect.r, rect.b, rect.g] = mutateColor(rect.r, rect.b, rect.g, rate)
    }
}

function mutateColor(r, g, b, rate) {
    let step = 20
    r += rate * randomGaussian(0, step)
    b += rate * randomGaussian(0, step)
    g += rate * randomGaussian(0, step)
    return [r, g, b]
}

function updateRectColors() {  // run when best score is foudn
    
}
