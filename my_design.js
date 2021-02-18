/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function p4_inspirations() {
    let imgs = [
        {
            name: "Nighthawks - Edward Hopper",
            assetUrl: "https://cdn.glitch.com/a9ccced7-5149-4223-becd-92be9a575a62%2Fnighthawks.jpg?v=1613688224211"
        }

    ];
    return imgs;
}

function p4_initialize(inspiration) {
    resizeCanvas(inspiration.image.width / 9, inspiration.image.height / 9);
    debug(inspiration);
    return {};
}

function debug(inspiration) {
    resizeCanvas(inspiration.image.width / 2, inspiration.image.height / 2);
    noLoop()
}

let vertices = [[20, 100], [300, 100], [500, 100]]

function draw_vertices(vertices) {
    fill("red")
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
    ellipse(10,200,10,20)
    vertices = subdivide_edge(vertices, 4, split_horizontal_edge)
    draw_vertices(vertices)
}

function subdivide_edge(vertices, amt, split_edge_func) {
    let result = vertices.slice();
    for(let sub_num = 0; sub_num < amt; sub_num++){
        let new_vertices = [];
        if(result.length > 0) {
            let additions = split_edge_func(result[0], result[1]);
            additions.forEach(v => { new_vertices.push(v) })
            print(new_vertices)
        };
        for(let idx = 1; idx < result.length-1; idx++) {
            print("inside")
            let additions = split_edge_func(result[idx], result[idx+1]);
            new_vertices.push(additions[1], additions[2])
        }
        result = new_vertices;
    }
    print(result)
    return result;
}

function split_horizontal_edge(vertex_1, vertex_2) {
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 | 0;
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 + random(-5, 5)
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

function split_vertical_edge(vertex_1, vertex_2) {
    let mid_x = (vertex_1[0] + vertex_2[0]) / 2 + random(-5, 5)
    let mid_y = (vertex_1[1] + vertex_2[1]) / 2 | 0;
    return [vertex_1, [mid_x, mid_y], vertex_2]
}

function p4_mutate(design, inspiration, rate) {
}
