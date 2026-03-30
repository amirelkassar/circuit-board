# Logic Gate Circuit Board Simulator

An interactive educational web application that simulates a digital logic circuit board. Users can toggle input switches and watch signals flow through logic gates to light LEDs, with a focus on learning how the eight basic logic gates behave.

## Features

- **Circuit board** — A single board showing 16 logic gates (two of each type) in four rows, in random order. Inputs A and B feed every gate; each gate drives one LED.
- **Learn the gates** — A guided section with a small game: one gate at a time, you use switches to light its lamp. Each gate has a short explanation and formula; you can pick any gate from the cards to try it.
- **Truth tables** — For each gate type, a truth table is shown and the row matching the current A and B is highlighted.
- **Visual feedback** — Wires glow (orange/yellow) when carrying a 1 and stay dark for 0. Junctions and bus LEDs reflect the same logic. When both switches are OFF, all lights stay off.
- **Hover tips** — Hovering a gate on the main board shows its name, formula, and how it affects the circuit.

## Technology

- **React 19** with **TypeScript**
- **Vite 6** for build and dev server
- **Functional components** and hooks only
- **SVG** for the circuit (wires, gates, LEDs, resistors, rails)
- **Tailwind CSS** v4 (with `@tailwindcss/vite`); theme tokens live as CSS variables in `src/index.css` for light/dark mode
- No backend; everything runs in the browser

## Getting started

### Prerequisites

- Node.js (e.g. 18+)
- npm (or pnpm / yarn)

### Install and run

```bash
# Install dependencies
npm install

# Start development server (e.g. http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project structure

```
soly/
├── index.html              # Entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx            # React entry, mounts App
    ├── App.tsx              # Tabs (Learn / Circuit board), tips, outputs summary
        ├── index.css            # Tailwind entry + theme CSS variables + keyframes
    ├── vite-env.d.ts
    ├── logic/
    │   ├── types.ts         # Signal, GateType, GATE_TYPES
    │   ├── gates.ts         # AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER + computeOutput
    │   └── gateData.ts      # Formula, description, explanation, getTruthTable
    └── components/
        ├── CircuitBoard.tsx          # Full board: 16 gates, A/B buses, rails, LEDs
        ├── GateGuide.tsx             # “Learn the gates” tab content
        ├── GameBoard.tsx             # Single-gate game board
        ├── TruthTable.tsx            # Truth tables for all gate types
        ├── PowerSource.tsx           # V+ / GND block
        ├── SwitchInput.tsx           # A / B toggle
        ├── Wire.tsx                  # SVG path, glows when active
        ├── Resistor.tsx              # Small resistor on bus
        ├── LogicGate.tsx             # Gate box with name (AND, OR, …)
        └── LampLED.tsx               # LED circle (green when on)
```

## Logic gates

| Gate   | Formula   | Description (short)                    |
|--------|-----------|----------------------------------------|
| AND    | A · B     | Output 1 only when both A and B are 1  |
| OR     | A + B     | Output 1 when at least one input is 1  |
| NOT    | Ā         | Inverts A (1→0, 0→1)                   |
| NAND   | ¬(A · B)  | Output 0 only when both are 1          |
| NOR    | ¬(A + B)  | Output 1 only when both are 0          |
| XOR    | A ⊕ B     | Output 1 when A ≠ B                    |
| XNOR   | A ⊙ B     | Output 1 when A = B                    |
| BUFFER | A         | Output equals A                        |

NOT and BUFFER use only input A; the rest use A and B.

## How the circuit board works

- **Inputs:** Two switches (A and B) feed the same signals to all 16 gates. When both are OFF, the app forces all gate outputs to 0 so every LED is off.
- **Layout:** Four rows of four gates. Gate order is random (two of each type). Each gate has one LED on the right; two extra LEDs on the left show when the A and B buses are high.
- **Wires:** Drawn in SVG. Active segments (signal 1) use an orange/yellow glow; junctions can highlight when the net is active. Output wires run from each gate to its LED in two segments.
- **Rails:** V+ and GND are drawn along the board; they are visual only and do not change gate logic.

## Learn tab

- **Game:** One gate is shown at a time. The lamp starts off; you use switches A and B to make that gate’s output 1 and light the lamp, then move to the next gate.
- **Cards:** You can click any gate card to load that gate in the game and read its explanation.
- **Text:** Each gate has a formula and a short “how it works” explanation, plus a line that the lamp starts off and you should light it with the switches.

## License

Private / educational use. Adjust as needed for your case.
