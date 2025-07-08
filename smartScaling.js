AFRAME.registerComponent('size', {
  schema: { type: 'string' },

  update: function () {
    const tag = this.el.tagName.toLowerCase();
    const raw = this.data.trim();
    const parts = raw.split(/[\s,]+/).map(Number);
    const has = (i) => typeof parts[i] === 'number' && !isNaN(parts[i]);

    const x = has(0) ? parts[0] : 1;
    const y = has(1) ? parts[1] : x;
    const z = has(2) ? parts[2] : x;

    const apply = (attrs) => {
      const geometry = {
        ...this.el.getAttribute('geometry'),
        ...attrs
      };
      this.el.setAttribute('geometry', geometry);
    };

    switch (tag) {
      case 'a-box':
        apply({ primitive: 'box', width: x, height: y, depth: z });
        break;

      case 'a-sphere':
      case 'a-circle':
      case 'a-dodecahedron':
      case 'a-octahedron':
      case 'a-tetrahedron':
      case 'a-icosahedron':
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
      case 'a-torus-knot': {
        const attrs = {
          primitive: tag.replace('a-', ''),
          radius: x,
          'segments-radial': 48,
          'segments-tubular': 64,
          'radius-tubular': has(1) ? y : Math.min(x * 0.1, 0.2)
        };
        apply(attrs);
        break;
      }

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
