"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { Board, ChessPiece, Position, Move, PieceColor } from "@/types/chess"
import { createInitialBoard, isValidMove, getSquareNotation } from "@/lib/chess-utils"
import { ChessSquare } from "./chess-square"
import { cn } from "@/lib/utils"

export function ChessBoard() {
  const [board, setBoard] = useState<Board>(createInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentTurn, setCurrentTurn] = useState<PieceColor>("white")
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position } | null>(null)

  const calculateValidMoves = useCallback(
    (pos: Position, piece: ChessPiece): Position[] => {
      const moves: Position[] = []

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(board, pos, { row, col }, piece)) {
            moves.push({ row, col })
          }
        }
      }

      return moves
    },
    [board],
  )

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const piece = board[row][col]

      // If a square is selected and this is a valid move
      if (selectedSquare && validMoves.some((m) => m.row === row && m.col === col)) {
        const newBoard = board.map((r) => [...r])
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col]
        const capturedPiece = newBoard[row][col]

        newBoard[row][col] = movingPiece
        newBoard[selectedSquare.row][selectedSquare.col] = null

        const move: Move = {
          from: selectedSquare,
          to: { row, col },
          piece: movingPiece!,
          captured: capturedPiece || undefined,
          timestamp: Date.now(),
        }

        setBoard(newBoard)
        setMoveHistory([...moveHistory, move])
        setLastMove({ from: selectedSquare, to: { row, col } })
        setSelectedSquare(null)
        setValidMoves([])
        setCurrentTurn(currentTurn === "white" ? "black" : "white")

        // Announce move for screen readers
        const notation = `${getSquareNotation(selectedSquare.row, selectedSquare.col)} to ${getSquareNotation(row, col)}`
        console.log("[v0] Move made:", notation)

        return
      }

      // Select a piece of the current player's color
      if (piece && piece.color === currentTurn) {
        setSelectedSquare({ row, col })
        setValidMoves(calculateValidMoves({ row, col }, piece))
      } else {
        setSelectedSquare(null)
        setValidMoves([])
      }
    },
    [board, selectedSquare, validMoves, currentTurn, moveHistory, calculateValidMoves],
  )

  const handleKeyDown = useCallback(
    (row: number, col: number, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleSquareClick(row, col)
      }
    },
    [handleSquareClick],
  )

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard())
    setSelectedSquare(null)
    setValidMoves([])
    setCurrentTurn("white")
    setMoveHistory([])
    setLastMove(null)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        role="grid"
        aria-label="Chess board"
        className={cn(
          "grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-2xl",
          "w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]",
        )}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0
            const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
            const isValidMoveSquare = validMoves.some((m) => m.row === rowIndex && m.col === colIndex)
            const isLastMoveSquare =
              (lastMove?.from.row === rowIndex && lastMove?.from.col === colIndex) ||
              (lastMove?.to.row === rowIndex && lastMove?.to.col === colIndex)

            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isValidMove={isValidMoveSquare}
                isLastMove={isLastMoveSquare}
                notation={getSquareNotation(rowIndex, colIndex)}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
              />
            )
          }),
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        <span className="font-mono">
          Current turn: <span className="text-foreground font-semibold capitalize">{currentTurn}</span>
        </span>
        <span className="text-muted-foreground/50">|</span>
        <span className="font-mono">
          Moves: <span className="text-foreground font-semibold">{moveHistory.length}</span>
        </span>
      </div>
    </div>
  )
}
