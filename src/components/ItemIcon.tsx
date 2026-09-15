import { shadeColor } from '../utils'

type Tone = 'main' | 'dark' | 'light' | 'white' | 'accent' | 'sky'
interface Part {
  t: number
  l: number
  w: number
  h: number
  c: Tone
  r?: number
}

const ACCENT = '#f5c542'
const SKY = '#7dd3fc'

// Каждая фигура описана в сетке 40×40 — так один и тот же набор «деталей»
// даёт узнаваемый силуэт вместо цветного пятна.
const ICONS: Record<string, Part[]> = {
  кровать: [{ t: 18, l: 4, w: 32, h: 14, c: 'main', r: 2 }, { t: 12, l: 6, w: 10, h: 8, c: 'white', r: 2 }, { t: 30, l: 4, w: 4, h: 6, c: 'dark' }, { t: 30, l: 32, w: 4, h: 6, c: 'dark' }],
  диван: [{ t: 16, l: 4, w: 32, h: 16, c: 'main', r: 3 }, { t: 8, l: 4, w: 6, h: 14, c: 'dark', r: 2 }, { t: 8, l: 30, w: 6, h: 14, c: 'dark', r: 2 }],
  стол: [{ t: 14, l: 4, w: 32, h: 6, c: 'main' }, { t: 20, l: 6, w: 4, h: 16, c: 'dark' }, { t: 20, l: 30, w: 4, h: 16, c: 'dark' }],
  стул: [{ t: 6, l: 12, w: 16, h: 16, c: 'main', r: 1 }, { t: 20, l: 14, w: 3, h: 14, c: 'dark' }, { t: 20, l: 23, w: 3, h: 14, c: 'dark' }],
  кресло: [{ t: 8, l: 8, w: 24, h: 18, c: 'main', r: 3 }, { t: 4, l: 8, w: 24, h: 8, c: 'dark', r: 3 }, { t: 26, l: 8, w: 4, h: 8, c: 'dark' }, { t: 26, l: 28, w: 4, h: 8, c: 'dark' }],
  шкаф: [{ t: 4, l: 8, w: 24, h: 32, c: 'main' }, { t: 4, l: 19, w: 2, h: 32, c: 'dark' }, { t: 16, l: 12, w: 2, h: 3, c: 'accent' }, { t: 16, l: 24, w: 2, h: 3, c: 'accent' }],
  полка: [{ t: 6, l: 6, w: 28, h: 4, c: 'main' }, { t: 18, l: 6, w: 28, h: 4, c: 'main' }, { t: 30, l: 6, w: 28, h: 4, c: 'main' }, { t: 0, l: 8, w: 4, h: 6, c: 'dark' }, { t: 12, l: 16, w: 4, h: 6, c: 'sky' }, { t: 24, l: 24, w: 4, h: 6, c: 'accent' }],
  ковёр: [{ t: 14, l: 4, w: 32, h: 18, c: 'main', r: 2 }, { t: 18, l: 8, w: 24, h: 10, c: 'dark', r: 2 }],
  лампа: [{ t: 4, l: 10, w: 20, h: 12, c: 'accent', r: 6 }, { t: 16, l: 18, w: 4, h: 14, c: 'dark' }, { t: 30, l: 12, w: 16, h: 4, c: 'dark' }],
  картина: [{ t: 4, l: 6, w: 28, h: 24, c: 'dark' }, { t: 8, l: 10, w: 20, h: 16, c: 'sky' }],
  растение: [{ t: 22, l: 12, w: 16, h: 14, c: 'dark', r: 2 }, { t: 4, l: 14, w: 12, h: 20, c: 'main', r: 8 }],
  сундук: [{ t: 14, l: 6, w: 28, h: 18, c: 'main', r: 2 }, { t: 8, l: 6, w: 28, h: 8, c: 'dark', r: 3 }, { t: 18, l: 18, w: 4, h: 4, c: 'accent' }],
  окно: [{ t: 6, l: 6, w: 28, h: 28, c: 'dark' }, { t: 9, l: 9, w: 10, h: 10, c: 'sky' }, { t: 21, l: 9, w: 10, h: 10, c: 'sky' }, { t: 9, l: 21, w: 10, h: 10, c: 'sky' }, { t: 21, l: 21, w: 10, h: 10, c: 'sky' }],
  дверь: [{ t: 4, l: 10, w: 20, h: 32, c: 'main' }, { t: 18, l: 24, w: 3, h: 3, c: 'accent' }],
  стена: [{ t: 4, l: 4, w: 32, h: 32, c: 'main' }, { t: 4, l: 4, w: 32, h: 4, c: 'dark' }, { t: 20, l: 4, w: 32, h: 4, c: 'dark' }],
  пол: [{ t: 8, l: 4, w: 32, h: 8, c: 'main' }, { t: 16, l: 4, w: 32, h: 8, c: 'dark' }, { t: 24, l: 4, w: 32, h: 8, c: 'main' }],
  шапка: [{ t: 10, l: 8, w: 24, h: 14, c: 'main', r: 12 }, { t: 22, l: 6, w: 28, h: 4, c: 'dark' }],
  причёска: [{ t: 6, l: 8, w: 24, h: 18, c: 'main', r: 12 }, { t: 20, l: 12, w: 16, h: 10, c: 'light', r: 6 }],
  обувь: [{ t: 20, l: 6, w: 28, h: 10, c: 'main', r: 4 }, { t: 14, l: 6, w: 10, h: 10, c: 'main', r: 3 }],
  куртка: [{ t: 6, l: 10, w: 20, h: 26, c: 'main', r: 2 }, { t: 6, l: 2, w: 8, h: 18, c: 'dark' }, { t: 6, l: 30, w: 8, h: 18, c: 'dark' }],
  свитер: [{ t: 8, l: 8, w: 24, h: 24, c: 'main', r: 3 }, { t: 8, l: 0, w: 8, h: 14, c: 'dark' }, { t: 8, l: 32, w: 8, h: 14, c: 'dark' }],
  плащ: [{ t: 4, l: 12, w: 16, h: 10, c: 'dark', r: 4 }, { t: 12, l: 6, w: 28, h: 26, c: 'main', r: 2 }],
  рюкзак: [{ t: 8, l: 10, w: 20, h: 26, c: 'main', r: 4 }, { t: 4, l: 14, w: 12, h: 8, c: 'dark', r: 3 }],
  очки: [{ t: 16, l: 4, w: 12, h: 10, c: 'sky', r: 5 }, { t: 16, l: 24, w: 12, h: 10, c: 'sky', r: 5 }, { t: 19, l: 16, w: 8, h: 3, c: 'dark' }],
  шарф: [{ t: 6, l: 4, w: 32, h: 8, c: 'main' }, { t: 14, l: 16, w: 8, h: 20, c: 'dark' }],
  перчатки: [{ t: 10, l: 8, w: 12, h: 18, c: 'main', r: 4 }, { t: 10, l: 20, w: 12, h: 18, c: 'main', r: 4 }],
  питомец: [{ t: 14, l: 10, w: 20, h: 16, c: 'main', r: 8 }, { t: 6, l: 14, w: 6, h: 8, c: 'main', r: 3 }, { t: 6, l: 20, w: 6, h: 8, c: 'main', r: 3 }],
  эффект: [{ t: 4, l: 18, w: 4, h: 32, c: 'accent' }, { t: 18, l: 4, w: 32, h: 4, c: 'accent' }],
  след: [{ t: 10, l: 8, w: 8, h: 12, c: 'main', r: 6 }, { t: 22, l: 22, w: 8, h: 12, c: 'main', r: 6 }],
  аура: [{ t: 4, l: 4, w: 32, h: 32, c: 'light', r: 16 }, { t: 12, l: 12, w: 16, h: 16, c: 'main', r: 8 }],
  крылья: [{ t: 8, l: 2, w: 14, h: 22, c: 'main', r: 8 }, { t: 8, l: 24, w: 14, h: 22, c: 'main', r: 8 }],
  тень: [{ t: 20, l: 6, w: 28, h: 10, c: 'dark', r: 5 }],
  сияние: [{ t: 16, l: 16, w: 8, h: 8, c: 'accent', r: 4 }, { t: 4, l: 18, w: 4, h: 10, c: 'accent' }, { t: 26, l: 18, w: 4, h: 10, c: 'accent' }, { t: 18, l: 4, w: 10, h: 4, c: 'accent' }, { t: 18, l: 26, w: 10, h: 4, c: 'accent' }],
  компьютер: [{ t: 6, l: 6, w: 28, h: 18, c: 'dark', r: 1 }, { t: 9, l: 9, w: 22, h: 12, c: 'sky' }, { t: 24, l: 14, w: 12, h: 3, c: 'main' }],
  монитор: [{ t: 4, l: 6, w: 28, h: 20, c: 'dark' }, { t: 7, l: 9, w: 22, h: 14, c: 'sky' }, { t: 24, l: 16, w: 8, h: 6, c: 'main' }],
  доска: [{ t: 6, l: 4, w: 32, h: 24, c: 'dark' }, { t: 10, l: 8, w: 10, h: 4, c: 'white' }, { t: 16, l: 8, w: 16, h: 4, c: 'white' }],
  документы: [{ t: 8, l: 8, w: 22, h: 26, c: 'white' }, { t: 4, l: 12, w: 22, h: 26, c: 'main' }],
  принтер: [{ t: 14, l: 6, w: 28, h: 14, c: 'main' }, { t: 6, l: 12, w: 16, h: 8, c: 'dark' }, { t: 28, l: 12, w: 16, h: 6, c: 'white' }],
  дерево: [{ t: 22, l: 17, w: 6, h: 14, c: 'dark' }, { t: 4, l: 6, w: 28, h: 22, c: 'main', r: 10 }],
  цветок: [{ t: 20, l: 18, w: 4, h: 14, c: 'dark' }, { t: 6, l: 12, w: 16, h: 16, c: 'main', r: 8 }, { t: 14, l: 16, w: 8, h: 8, c: 'accent', r: 4 }],
  куст: [{ t: 12, l: 6, w: 28, h: 20, c: 'main', r: 10 }],
  камень: [{ t: 14, l: 6, w: 28, h: 20, c: 'main', r: 6 }, { t: 18, l: 12, w: 8, h: 4, c: 'dark' }],
  гриб: [{ t: 20, l: 16, w: 8, h: 14, c: 'white' }, { t: 8, l: 6, w: 28, h: 16, c: 'main', r: 14 }],
  фонарь: [{ t: 6, l: 12, w: 16, h: 20, c: 'accent', r: 3 }, { t: 26, l: 16, w: 8, h: 10, c: 'dark' }],
  дорожка: [{ t: 16, l: 4, w: 10, h: 10, c: 'main', r: 5 }, { t: 16, l: 18, w: 10, h: 10, c: 'main', r: 5 }, { t: 16, l: 32, w: 6, h: 10, c: 'main', r: 5 }],
  пруд: [{ t: 12, l: 4, w: 32, h: 18, c: 'sky', r: 9 }],
  кустарник: [{ t: 10, l: 4, w: 16, h: 16, c: 'main', r: 8 }, { t: 16, l: 18, w: 18, h: 16, c: 'dark', r: 8 }],
  клумба: [{ t: 20, l: 4, w: 32, h: 10, c: 'dark', r: 3 }, { t: 10, l: 8, w: 8, h: 8, c: 'main', r: 4 }, { t: 10, l: 18, w: 8, h: 8, c: 'accent', r: 4 }, { t: 10, l: 28, w: 6, h: 8, c: 'main', r: 4 }],
  портал: [{ t: 4, l: 10, w: 20, h: 32, c: 'main', r: 10 }, { t: 8, l: 14, w: 12, h: 24, c: 'dark', r: 8 }],
  статуя: [{ t: 4, l: 14, w: 12, h: 18, c: 'main' }, { t: 22, l: 8, w: 24, h: 10, c: 'dark' }],
  трон: [{ t: 4, l: 8, w: 24, h: 12, c: 'accent' }, { t: 16, l: 8, w: 24, h: 20, c: 'main' }],
  фонтан: [{ t: 22, l: 4, w: 32, h: 10, c: 'main', r: 5 }, { t: 8, l: 16, w: 8, h: 16, c: 'sky' }],
  кристалл: [{ t: 6, l: 16, w: 8, h: 12, c: 'light' }, { t: 18, l: 8, w: 24, h: 16, c: 'main', r: 3 }],
  реликвия: [{ t: 8, l: 8, w: 24, h: 24, c: 'main', r: 4 }, { t: 16, l: 16, w: 8, h: 8, c: 'accent' }],
  артефакт: [{ t: 6, l: 12, w: 16, h: 26, c: 'main', r: 6 }, { t: 4, l: 15, w: 10, h: 8, c: 'accent', r: 4 }],
  корона: [{ t: 16, l: 6, w: 28, h: 12, c: 'main' }, { t: 8, l: 8, w: 6, h: 10, c: 'main' }, { t: 4, l: 17, w: 6, h: 14, c: 'main' }, { t: 8, l: 26, w: 6, h: 10, c: 'main' }],
  скипетр: [{ t: 4, l: 16, w: 8, h: 8, c: 'accent', r: 4 }, { t: 12, l: 18, w: 4, h: 24, c: 'main' }],
}

function noun(name: string): string {
  const parts = name.trim().split(' ')
  return parts[parts.length - 1].toLowerCase().replace(/[«»№0-9]/g, '').trim()
}

export function ItemIcon({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const key = noun(name)
  const parts = ICONS[key]
  const scale = size / 40
  const tone = (t: Tone) => {
    if (t === 'main') return color
    if (t === 'dark') return shadeColor(color, -0.25)
    if (t === 'light') return shadeColor(color, 0.25)
    if (t === 'white') return '#f4f6f8'
    if (t === 'accent') return ACCENT
    if (t === 'sky') return SKY
    return color
  }

  if (!parts) {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: size * 0.15, background: color, border: '2px solid #12181f' }} />
      </div>
    )
  }

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {parts.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: p.t * scale,
            left: p.l * scale,
            width: p.w * scale,
            height: p.h * scale,
            background: tone(p.c),
            borderRadius: p.r ? p.r * scale : 0,
            border: '1.5px solid #12181f',
          }}
        />
      ))}
    </div>
  )
}
