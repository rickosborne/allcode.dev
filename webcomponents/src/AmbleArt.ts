import {html} from '../node_modules/lit-element/lit-element.js';

// function artSvg(
//   iconName: string,
//   bounds: string = '-1 -1 11 11',
//   prefix: string = '/src/',
// ): TemplateResult {
//   return html`
//     <svg viewBox="${bounds}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//       <use xlink:href="${prefix}#${iconName}"></use>
//     </svg>
//   `;
// }

export const ARROW_LEFT_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.5,4.5 l4,-4 v8 z" />
	</svg>
`;

export const ARROW_RIGHT_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.5,4.5 l-4,4 v-8 z" />
	</svg>
`;

export const WALK_THROUGH_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,7 l2,-2 v4 l-2,-2 M9,7 l-2,2 v-4 l2,2 M4,4.5 v3.5 h1 v-3.5 M5,5.5 a2.5,2.5,0,1,0,-1,0 v-1 a1.5,1.5,0,1,1,1,0 v1" />
	</svg>
`;

export const SELF_ASSESSMENT_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,7 l2,-2 v4 l-2,-2 M4,7 h1 v1 h-1 v-1 M9,7 l-2,2 v-4 l2,2 M4,6 h1 v-1 l2,-2 v-1.5 l-1,-1 h-3 l-1,1 l0.6,0.6 l1,-0.7 h1.8 l0.7,0.7 v0.5 l-2,2 v1.4" />
	</svg>
`;

export const SHOW_LESS_SVG = html`
	<svg viewbox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0.5,5 l4,-4 l4,4 l-1,1 l-3,-3 l-3,3 z" />
		<path d="M0,8 h1 v1 h-1 v-1 M2,8 h1 v1 h-1 v-1 M4,8 h1 v1 h-1 v-1 M6,8 h1 v1 h-1 v-1 M8,8 h1 v1 h-1 v-1" />
	</svg>
`;

export const CHECKED_BOX_SVG = html`
	<svg viewbox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M1,1 h6 l-1,1 h-4 v5 h5 v-2 l1,-1 v4 h-7 z" />
		<path d="M2,5 l1,-1 l1,1 l4,-4 l1,1 l-5,5 z" />
	</svg>
`;

export const LAYOUT_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,0 h4 v5 h-4 v-4 M5,0 h4 v3 h-4 v-3 M0,6 h4 v3 h-4 v-3 M5,4 h4 v5 h-4 v-5" />
	</svg>
`;

export const FULL_SCREEN_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,0 h3 v1 h-2 v2 h-1 v-3 M6,0 h3 v3 h-1 v-2 h-2 v-1 M8,6 h1 v3 h-3 v-1 h2 v-2 M0,9 v-3 h1 v2 h2 v1 h-3" />
	</svg>
`;

export const EXIT_FULL_SCREEN_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M2,4 v-1 h2 v-2 h1 v3 h-3 M6,4 v-3 h1 v2 h2 v1 h-3 M2,5 h3 v3 h-1 v-2 h-2 v-1 M6,5 h3 v1 h-2 v2 h-1 v-3" />
	</svg>
`;

export const INFO_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.5,1 a3.5,3.5,0,0,1,0,7 v-1 h0.5 v-3.5 h-0.5 v-0.5 a0.5,0.5,0,0,0,0,-1 v-1 a3.5,3.5,0,0,0,0,7 v-1 h-0.5 v-3.5 h0.5 v-0.5 a0.5,0.5,0,0,1,0,-1 v-1" />
	</svg>
`;

export const SHOW_MORE_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,3 q2,-2,4.5,-2 q2.5,0,4.5,2 h-3 A1.5,1.5,0,0,0,3,3 A1.5,1.5,0,0,0,6,3 h3 q-2.5,2,-4.5,2 q-2,0,-4.5-2 M4,3 A0.5,0.5,0,0,0,5,3 A0.5,0.5,0,0,0,4,3 M0.5,6 l0.5,-0.5 l3.5,2 l3.5,-2 l0.5,0.5 l-4,2.25 l-4,-2.25" />
	</svg>
`;

export const LINK_SVG = html`
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M1,8 v-4 h1 v3 h3 v1 h-4 m2,-3 l2,-2 l-1,-1 h3 v3 l-1,-1 l-2,2 l-1,-1" />
	</svg>
`;
