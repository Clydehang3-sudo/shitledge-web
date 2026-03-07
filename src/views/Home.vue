<template>
  <section class="journal-cover">
    <div class="poop-orbit" aria-hidden="true">
      <img class="poop-float poop-float-a" :src="poopOutline" alt="" />
      <img class="poop-float poop-float-b" :src="poopOutline" alt="" />
      <img class="poop-float poop-float-c" :src="poopOutline" alt="" />
    </div>

    <p class="eyebrow">Independent Institute of Absurd Studies</p>
    <p class="hero-kicker">Volume 1 · Issue 1 · Established 2026</p>

    <div class="cover-block">
      <p class="cover-label">Current Cover Story</p>
      <h1>知屎 Shitledge</h1>
      <p class="subhead">Journal of Quantified Absurdity and Peer-Reviewed Delusion</p>
      <p class="cover-note">A peer-reviewed home for statistically significant nonsense.</p>
      <router-link class="cover-cta" to="/articles">Browse Issue</router-link>
    </div>

    <section class="plate-gallery" aria-label="Illustrated archive plates">
      <figure class="plate-card detail-paper">
        <img :src="plateOne" alt="Coprolite Geometry archival plate" />
        <figcaption>Plate I · Coprolite Geometry</figcaption>
      </figure>
      <figure class="plate-card detail-paper">
        <img :src="plateTwo" alt="Field notes on urban coprology" />
        <figcaption>Plate II · Field Notes in Urban Coprology</figcaption>
      </figure>
    </section>

    <div class="home-grid">
      <article class="panel">
        <h2>Current Issue</h2>
        <p>Volume 1, Issue 1: The Metrics of Everyday Nonsense.</p>
      </article>
      <article class="panel">
        <h2>Editorial Position</h2>
        <p>We believe bad decisions deserve better documentation.</p>
      </article>
      <article class="panel">
        <h2>Submission Window</h2>
        <p>Open year-round for rigorous nonsense with reproducible chaos.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import poopOutline from '../assets/poop-outline.svg'
import plateOne from '../assets/coprolite-plate.svg'
import plateTwo from '../assets/field-notes.svg'
</script>
