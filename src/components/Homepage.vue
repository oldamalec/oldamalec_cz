<template>
    <div id="homepage">
        <div id="svg"/>
        <div id="name" class="mt-40">Ing. Oldřich Malec</div>
        <div id="mail" class="mt-20">
            <a href="mailto:oldamalec@gmail.com"
               @click="logClick('mail')"
            >
                oldamalec@gmail.com
            </a>
        </div>
        <div class="mt-20">
            <a v-for="site of social"
               :key="site.alt"
               :href="site.href"
               target="_blank"
               @click="logClick(site.alt)"
            >
                <img class="social"
                     :src="site.src"
                     :alt="site.alt"
                     rel="noreferrer"
                />
            </a>
        </div>
    </div>
</template>

<script>

import {SVG} from "@svgdotjs/svg.js";
import Delaunay from "faster-delaunay";
import firebase from "firebase";

export default {
    name: "Homepage",
    data: () => ({
        social: [{
            alt: 'LinkedIn',
            href: 'https://www.linkedin.com/in/old%C5%99ich-malec/',
            src: 'li.png',
        }, {
            alt: 'Facebook',
            href: 'https://www.facebook.com/olda.malec/',
            src: 'fb.svg',
        }]
    }),
    mounted: function () {
        this.drawHeader();
        setInterval(() => {
            document.getElementById('svg').textContent = '';
            this.drawHeader();
        }, 3000);
    },
    methods: {
        drawHeader: function () {
            this.drawPolygons(SVG().addTo('#svg').size('100%', '65vh'), this.generatePoints());
        },
        generatePoints: function () {
            const maxWidth = document.getElementById('svg').offsetWidth;
            const maxHeight = document.getElementById('svg').offsetHeight;
            const points = [];
            for (let i = 0; i < 200; ++i) {
                points.push([
                    Math.round(Math.random() * maxWidth),
                    Math.round(Math.random() * maxHeight)
                ]);
            }
            for (let x = 0; x < maxWidth; x += Math.round(Math.random() * maxWidth) / 6) {
                points.push([x, 0]);
                points.push([x, maxHeight]);
            }
            for (let y = 0; y < maxHeight; y += Math.round(Math.random() * maxHeight) / 6) {
                points.push([0, y]);
                points.push([maxWidth, y]);
            }
            points.push([maxWidth, maxHeight]);
            return points;
        },
        drawPolygons: function (draw, points) {
            const delaunay = Delaunay(points);
            const triangles = delaunay.triangulate();
            let r = 0x65;
            let g = 0x95;
            let b = 0xff;
            for (let i = 0; i < triangles.length; i += 3) {
                const p1 = triangles[i];
                const p2 = triangles[i + 1];
                const p3 = triangles[i + 2];
                draw.polygon(p1[0] + ',' + p1[1] + ' ' + p2[0] + ',' + p2[1] + ' ' + p3[0] + ',' + p3[1]).fill('#' + (this.hexFromRgb(r, g, b).toString(16)));

                if (i % 10 === 0) {
                    g += 2;
                    r += 2;
                }
            }
        },
        hexFromRgb: function (r, g, b) {
            return (0x10000 * r) + (0x100 * g) + b
        },
        logClick: function (label) {
            firebase.analytics().logEvent('click_' + label);
        }
    }
}
</script>

<style scoped>
#name {
    font-size: 20px;
}

.mt-40 {
    margin-top: 40px;
}

.mt-20 {
    margin-top: 20px
}

.social {
    height: 5vh;
    margin: 10px;
}
</style>

<style>
polygon:hover {
    stroke: black;
}
</style>
