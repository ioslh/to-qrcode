<template>
  <div class="home-page">
    <div class="home-inner">
      <!-- Hero -->
      <div class="hero">
        <div class="hero-badge">
          <Sparkles :size="12" />
          <span>For developers</span>
        </div>
        <div class="hero-logo">
          <img src="/logo.svg" alt="to-qrcode" />
        </div>
        <h1 class="hero-title">
          Anything<br /><span class="gradient-text">to QR code</span>
        </h1>
        <p class="hero-desc">
          Write a rule, convert anything to a QR code.<br />
          TypeScript-powered, stored locally, shareable by URL.
        </p>
        <div class="hero-actions">
          <router-link to="/new" class="btn-primary-link">
            <Plus :size="16" />
            Create your first rule
          </router-link>
          <a
            href="https://github.com/ioslh/to-qrcode"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary-link"
          >
            <Github :size="16" />
            View on GitHub
          </a>
        </div>
      </div>

      <!-- Feature cards -->
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon ts-icon">
            <img src="/ts.svg" alt="TypeScript" class="w-5 h-5" />
          </div>
          <h3>TypeScript-first</h3>
          <p>Define an interface and a function — we handle everything else: form generation, execution, and QR output.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <Lock :size="18" />
          </div>
          <h3>Local & private</h3>
          <p>All your rules and data are stored in your browser. Nothing is sent to a server — safe, fast, and offline-ready.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon share-icon">
            <Share2 :size="18" />
          </div>
          <h3>Shareable</h3>
          <p>Rules can be shared as a compact URL. Anyone with the link can use your rule instantly — no signup required.</p>
        </div>
      </div>

      <!-- How it works -->
      <div class="how-it-works">
        <h2>One simple step</h2>
        <p class="how-desc">Define an interface + function, and we'll auto-generate a smart form that runs your code and outputs a QR code.</p>
        <div class="step-row">
          <div class="step-card">
            <div class="step-num">1</div>
            <img src="https://to-qrcode.oss-cn-beijing.aliyuncs.com/iface.png" alt="Define interface" class="step-img" />
            <p>Define an interface with your parameters</p>
          </div>
          <div class="step-arrow">
            <ArrowRight :size="24" />
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <img src="https://to-qrcode.oss-cn-beijing.aliyuncs.com/form.png" alt="Fill the form" class="step-img" />
            <p>Fill the auto-generated form and get your QR code</p>
          </div>
        </div>
      </div>

      <!-- Builtin rules hint -->
      <div class="builtin-hint">
        <Zap :size="14" class="zap-icon" />
        <span>Already have <strong>4 builtin rules</strong> to get you started — text, vCard, Eleme, Lark mini-app.</span>
        <router-link to="/rules/text/gen" class="hint-link">Try now →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Github, Lock, Share2, Sparkles, ArrowRight, Zap } from 'lucide-vue-next'
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

.home-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;
}

/* ── Hero ───────────────────────────────────────── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  gap: 16px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.hero-logo img {
  width: 64px;
  height: 64px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: hsl(var(--foreground));
  margin: 0;
}

.gradient-text {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(262 83% 58%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 16px;
  color: hsl(var(--muted-foreground));
  line-height: 1.7;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.btn-primary-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-primary-link:hover {
  opacity: 0.9;
  text-decoration: none;
}

.btn-secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-secondary-link:hover {
  background: hsl(var(--accent));
  text-decoration: none;
}

/* ── Feature cards ──────────────────────────────── */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.2s;
}

.feature-card:hover {
  box-shadow: 0 4px 24px hsl(var(--primary) / 0.08);
}

.feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.ts-icon {
  background: hsl(211 100% 50% / 0.1);
}

.share-icon {
  background: hsl(142 71% 45% / 0.1);
  color: hsl(142 71% 40%);
}

.feature-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.feature-card p {
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  line-height: 1.6;
}

/* ── How it works ───────────────────────────────── */
.how-it-works {
  text-align: center;
}

.how-it-works h2 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: hsl(var(--foreground));
}

.how-desc {
  margin-top: 8px;
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.step-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
}

.step-card {
  flex: 1;
  max-width: 340px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.step-num {
  position: absolute;
  top: -12px;
  left: 20px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 24px hsl(0 0% 0% / 0.1);
}

.step-card p {
  margin-top: 16px;
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  text-align: center;
  line-height: 1.5;
}

.step-arrow {
  color: hsl(var(--muted-foreground));
  flex-shrink: 0;
}

/* ── Builtin hint ───────────────────────────────── */
.builtin-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: hsl(142 71% 45% / 0.08);
  border: 1px solid hsl(142 71% 45% / 0.2);
  border-radius: 10px;
  font-size: 13px;
  color: hsl(var(--foreground));
}

.zap-icon {
  color: hsl(142 71% 40%);
  flex-shrink: 0;
}

.hint-link {
  margin-left: 4px;
  color: hsl(var(--primary));
  font-weight: 600;
  text-decoration: none;
}

.hint-link:hover {
  text-decoration: underline;
}
</style>
