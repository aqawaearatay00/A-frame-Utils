AFRAME.registerComponent('size', {
  schema: { type: 'string' },

  init: function () {
    const tag = this.el.tagName.toLowerCase();
    const raw = this.data.trim();

    // Parse values like "2", "2 3", or "2,3"
    const parts = raw.split(/[\s,]+/).map(Number);
    let x = 1, y = 1, z = 1;
    if (parts.length === 1) {
      x = y = z = parts[0];
    } else {
      [x = 1, y = x, z = x] = parts;
    }

    const apply = (attrs) => {
      this.el.setAttribute('geometry', {
        ...this.el.getAttribute('geometry'),
        ...attrs
      });
    };

    switch (tag) {
      case 'a-box':
        apply({ primitive: 'box', width: x, height: y, depth: z });
        break;

      case 'a-sphere':
      case 'a-dodecahedron':
      case 'a-octahedron':
      case 'a-tetrahedron':
      case 'a-icosahedron':
      case 'a-circle':
        apply({ primitive: tag.replace('a-', ''), radius: x });
        break;

      case 'a-cylinder':
        apply({ primitive: 'cylinder', radius: x / 2, height: y });
        break;

      case 'a-cone':
        apply({
          primitive: 'cone',
          height: y,
          'radius-bottom': x * 0.75,
          'radius-top': z * 0.1
        });
        break;

      case 'a-torus':
      case 'a-torus-knot':
        apply({
          primitive: tag.replace('a-', ''),
          radius: x,
          'radius-tubular': y || x * 0.2
        });
        break;

      case 'a-plane':
        apply({ primitive: 'plane', width: x, height: y });
        break;

      case 'a-ring':
        apply({
          primitive: 'ring',
          'radius-outer': x,
          'radius-inner': x * 0.75
        });
        break;

      default:
        console.warn(`<${tag}> is not handled by 'size' component`);
    }
  }
});
