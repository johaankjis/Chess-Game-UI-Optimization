"use client"

import type React from "react"

import type { ChessPiece } from "@/types/chess"
import { getPieceSymbol } from "@/lib/chess-utils"
import { cn } from "@/lib/utils"

interface ChessSquareProps {
  piece: ChessPiece | null
  isLight: boolean
  isSelected: boolean
  isValidMove: boolean
  isLastMove: boolean
  notation: string
  onClick: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function ChessSquare({
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  notation,
  onClick,
  onKeyDown,
}: ChessSquareProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="gridcell"
      aria-label={`${notation}${piece ? `, ${piece.color} ${piece.type}` : ", empty"}`}
      tabIndex={0}
      className={cn(
        "relative aspect-square flex items-center justify-center text-4xl sm:text-5xl md:text-6xl transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:z-10",
        "hover:brightness-110",
        isLight ? "bg-[var(--chess-light)]" : "bg-[var(--chess-dark)]",
        isSelected && "ring-2 ring-[var(--chess-selected)] ring-offset-2 ring-offset-background brightness-125",
        isValidMove && "after:absolute after:inset-0 after:bg-[var(--chess-valid-move)] after:opacity-30",
        isLastMove && "ring-1 ring-accent/50",
      )}
    >
      {piece && (
        <span
          className={cn(
            "select-none transition-transform hover:scale-110",
            piece.color === "white" ? "text-foreground drop-shadow-lg" : "text-background drop-shadow-lg",
          )}
          aria-hidden="true"
        >
          {getPieceSymbol(piece)}
        </span>
      )}
      {isValidMove && !piece && (
        <div className="w-3 h-3 rounded-full bg-[var(--chess-valid-move)] opacity-60" aria-hidden="true" />
      )}
      {isValidMove && piece && (
        <div
          className="absolute inset-0 border-4 border-[var(--chess-capture)] opacity-60 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
