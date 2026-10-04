import type { Meta, StoryObj } from "@storybook/react-vite"

// The title page of the compliance section: what this is, in the words it
// is presented with, and where to look.

function Overview() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <p className="text-sm font-medium text-muted-foreground">shadcn-wcag-compliance</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">
        Правила доступности задаются один раз — и держатся при каждой правке, даже агентом
      </h1>
      <p className="mt-6 text-lg leading-relaxed">
        Доступный продукт легче и очевиднее для большего числа людей — и поэтому может приносить больше денег.
        У нас дизайн-система на shadcn, и это система контроля её доступности: специалист один раз задаёт
        правило, а спорное решение фиксирует как прецедент. Дальше каждая правка — в том числе агентская —
        проверяется по этим правилам и решениям.
      </p>
      <h2 className="mt-10 text-xl font-semibold">Где смотреть</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
        <li>
          <b>Любая история</b> → вкладка <b>Accessibility</b>: находки axe и наши правила в одной вкладке.
          Начать с <i>shadcn › Input › With Label</i> — рамка поля 1,26:1 при нужных 3:1.
        </li>
        <li>
          <b>Run tests</b> (внизу слева, галочка Accessibility): все состояния всех компонентов, обе темы.
        </li>
        <li>
          <b>WCAG compliance › Precedents</b>: решения человека по спорным случаям — кто, когда, почему, до
          какого числа; черновики, которые ждут решения.
        </li>
      </ul>
      <h2 className="mt-10 text-xl font-semibold">Как это устроено</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>Абзац стандарта WCAG 2.2 — дословно, с датой редакции (<code>standards/</code>).</li>
        <li>Правило по нему в формате W3C ACT, с версией и примерами (<code>rules/own/</code>).</li>
        <li>Код с тем же именем; исполняется здесь, в Storybook, и в хуке при правке (<code>src/rules/</code>).</li>
        <li>Три исхода: чисто → в отчёт; нарушено → правка не записывается; не знаю → человеку.</li>
        <li>Решение человека — карточка прецедента; проверка её читает (<code>precedents/</code>).</li>
      </ol>
      <p className="mt-10 text-sm text-muted-foreground">
        Репозиторий: github.com/balaka/shadcn-wcag-compliance · октябрь 2026
      </p>
    </div>
  )
}

const meta = {
  title: "WCAG compliance/Overview",
  component: Overview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Overview>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = { name: "Overview" }
