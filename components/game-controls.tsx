"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Info } from "lucide-react"

interface GameControlsProps {
  onReset: () => void
  moveCount: number
}

export function GameControls({ onReset, moveCount }: GameControlsProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Game Controls</h2>
        <Button onClick={onReset} variant="outline" size="sm" className="gap-2 bg-transparent" aria-label="Reset game">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-foreground font-medium">How to play:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Click or tap a piece to select it</li>
              <li>Valid moves will be highlighted</li>
              <li>Click a highlighted square to move</li>
              <li>Use keyboard navigation with Tab and Enter</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground font-mono">{moveCount}</p>
            <p className="text-xs text-muted-foreground">Total Moves</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent font-mono">95+</p>
            <p className="text-xs text-muted-foreground">Performance Score</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
