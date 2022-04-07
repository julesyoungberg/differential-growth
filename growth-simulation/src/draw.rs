use crate::vec2::*;

pub fn draw_path(ctx: &web_sys::CanvasRenderingContext2d, points: &[Vec2], cyclic: bool) {
    ctx.save();
    ctx.begin_path();
    ctx.set_line_width(1.0);
    ctx.set_stroke_style(&"#ffffff".into());

    for (index, point) in points.iter().enumerate() {
        let mut prev_index = index;
        if index == 0 {
            if cyclic {
                prev_index = points.len() - 1;
            } else {
                continue;
            }
        } else {
            prev_index -= 1;
        }

        let prev_point = &points[prev_index];

        ctx.move_to(prev_point.x, prev_point.y);
        ctx.line_to(point.x, point.y);
        ctx.stroke();
    }

    ctx.restore();
}
