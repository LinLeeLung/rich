<template>
  <div
    class="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"
  >
    <header class="relative overflow-hidden">
      <div class="mx-auto max-w-6xl px-6 pt-12 pb-6">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/20"
        >
          新手也能懂的被動收入試算(每人都要會的理財)
        </div>
        <h1
          class="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          理財分身試算
        </h1>
        <p class="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          輸入你的 <span class="font-semibold">月收入</span>、<span
            class="font-semibold"
            >儲蓄率</span
          >
          與 <span class="font-semibold">年化報酬率</span>，
          立刻看到不同時間點能創造多少個「分身」（投資現金流 / 目前月收入）。
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 pb-20 space-y-8">
      <!-- 輸入卡片 -->
      <section class="grid gap-4 md:grid-cols-3">
        <div class="glass-card">
          <label class="label">現在月收入（TWD）</label>
          <input v-model.number="income" type="number" min="0" class="input" />
        </div>
        <div class="glass-card">
          <label class="label">儲蓄率（%）</label>
          <input
            v-model.number="saveRatePct"
            type="number"
            min="0"
            max="100"
            class="input"
          />
        </div>
        <div class="glass-card">
          <label class="label">年化報酬率（%）</label>
          <input
            v-model.number="apyPct"
            type="number"
            step="0.1"
            class="input"
          />
        </div>
      </section>

      <!-- KPI -->
      <section class="grid gap-4 md:grid-cols-3">
        <div class="kpi">
          <div class="kpi-label">每月投入</div>
          <div class="kpi-value text-indigo-600 dark:text-indigo-300">
            {{ currency(monthlyContribution) }}
          </div>
        </div>
        <div class="kpi">
          <div class="kpi-label">月報酬率</div>
          <div class="kpi-value">{{ (monthlyRate * 100).toFixed(3) }}%</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">達 1 個分身（預估）</div>
          <div class="kpi-value">
            <span
              v-if="fiMonthIndex !== null"
              class="text-emerald-600 dark:text-emerald-300"
            >
              {{ monthsToYears(fiMonthIndex) }}
            </span>
            <span v-else class="opacity-60">20 年內尚未達成</span>
          </div>
        </div>
      </section>

      <!-- 里程碑表 -->
      <section class="glass-card p-0 overflow-hidden">
        <div
          class="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-white/10"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            里程碑試算
          </h2>
          <span class="text-xs text-slate-500 dark:text-slate-400"
            >期末投入、按月複利</span
          >
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead
              class="bg-slate-50/60 dark:bg-white/5 text-slate-600 dark:text-slate-300"
            >
              <tr>
                <th class="th">時間</th>
                <th class="th text-left">累積資產</th>
                <th class="th text-left">每月投資現金流</th>
                <th class="th text-left">分身數</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in milestoneRows"
                :key="row.label"
                class="odd:bg-white even:bg-slate-50/60 dark:odd:bg-white/5 dark:even:bg-white/0"
              >
                <td class="td">{{ row.label }}</td>
                <td class="td text-left font-medium">
                  {{ currency(row.asset) }}
                </td>
                <td class="td text-left">
                  {{ currency(row.asset * monthlyRate) }}
                </td>
                <td class="td text-left">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-sm font-semibold',
                      row.clones >= 1
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
                    ]"
                  >
                    {{ row.clones.toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p
          class="p-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/10"
        >
          * 「分身」=（資產 × 月報酬率）÷
          月收入。未計稅費、波動與再平衡；僅供概念試算。
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

/** 使用者輸入 */
const income = ref(60000);
const saveRatePct = ref(30);
const apyPct = ref(9);

/** 衍生值 */
const monthlyContribution = computed(
  () => income.value * (saveRatePct.value / 100)
);
const monthlyRate = computed(() => apyPct.value / 100 / 12);

/** 期末投入：FV = P * ((1+r)^n - 1) / r  */
function assetAfterMonths(n: number) {
  const P = monthlyContribution.value;
  const r = monthlyRate.value;
  if (r === 0) return P * n;
  return P * ((Math.pow(1 + r, n) - 1) / r);
}

/** 20 年內達 1 分身的最早月份 */
const fiMonthIndex = computed(() => {
  const r = monthlyRate.value;
  if (income.value <= 0) return null;
  for (let m = 1; m <= 240; m++) {
    const A = assetAfterMonths(m);
    const clones = (A * r) / income.value;
    if (clones >= 1) return m;
  }
  return null;
});

/** 里程碑 */
const milestones = [12, 36, 60, 120, 240];
const milestoneRows = computed(() =>
  milestones.map((m) => {
    const A = assetAfterMonths(m);
    const clones =
      income.value > 0 ? (A * monthlyRate.value) / income.value : 0;
    return { label: `${m / 12} 年`, months: m, asset: A, clones };
  })
);

/** 輔助 */
function currency(n: number) {
  return n.toLocaleString("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  });
}
function monthsToYears(m: number) {
  const y = Math.floor(m / 12),
    mm = m % 12;
  return y > 0 ? `${y} 年 ${mm} 個月` : `${mm} 個月`;
}
</script>

<style scoped>
/* 玻璃卡片 + 通用樣式（Tailwind 補強） */
.glass-card {
  @apply rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur
         dark:border-white/10 dark:bg-white/5;
}
.label {
  @apply block text-sm mb-1 text-slate-600 dark:text-slate-300;
}
.input {
  @apply w-full rounded-xl border border-slate-300/70 bg-white px-3 py-2 text-slate-900 shadow-sm
         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
         dark:bg-white/5 dark:text-white dark:border-white/10;
}
.kpi {
  @apply glass-card flex flex-col gap-1;
}
.kpi-label {
  @apply text-sm text-slate-500 dark:text-slate-400;
}
.kpi-value {
  @apply text-2xl font-bold text-slate-900 dark:text-white;
}
.th {
  @apply text-left p-3 font-medium tracking-wide;
}
.td {
  @apply p-3 text-slate-700 dark:text-slate-200 border-b border-slate-200/60 dark:border-white/10;
}
</style>
