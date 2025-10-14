import type { Board, ChessPiece, Position, PieceType } from "@/types/chess"

export const PIECE_SYMBOLS: Record<PieceType, { white: string; black: string }> = {
  king: { white: "♔", black: "♚" },
  queen: { white: "♕", black: "♛" },
  rook: { white: "♖", black: "♜" },
  bishop: { white: "♗", black: "♝" },
  knight: { white: "♘", black: "♞" },
  pawn: { white: "♙", black: "♟" },
}

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Black pieces
  board[0] = [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ]
  board[1] = Array(8).fill({ type: "pawn", color: "black" })

  // White pieces
  board[6] = Array(8).fill({ type: "pawn", color: "white" })
  board[7] = [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ]

  return board
}

export function isValidMove(board: Board, from: Position, to: Position, piece: ChessPiece): boolean {
  // Basic validation
  if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false

  const targetPiece = board[to.row][to.col]
  if (targetPiece && targetPiece.color === piece.color) return false

  // Simplified move validation for MVP
  const rowDiff = Math.abs(to.row - from.row)
  const colDiff = Math.abs(to.col - from.col)

  switch (piece.type) {
    case "pawn":
      const direction = piece.color === "white" ? -1 : 1
      const startRow = piece.color === "white" ? 6 : 1

      // Forward move
      if (to.col === from.col && !targetPiece) {
        if (to.row === from.row + direction) return true
        if (from.row === startRow && to.row === from.row + 2 * direction) return true
      }

      // Capture
      if (colDiff === 1 && to.row === from.row + direction && targetPiece) {
        return true
      }
      return false

    case "rook":
      return (rowDiff === 0 || colDiff === 0) && isPathClear(board, from, to)

    case "knight":
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)

    case "bishop":
      return rowDiff === colDiff && isPathClear(board, from, to)

    case "queen":
      return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && isPathClear(board, from, to)

    case "king":
      return rowDiff <= 1 && colDiff <= 1

    default:
      return false
  }
}

function isPathClear(board: Board, from: Position, to: Position): boolean {
  const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0
  const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol]) return false
    currentRow += rowStep
    currentCol += colStep
  }

  return true
}

export function getSquareNotation(row: number, col: number): string {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]
  return `${files[col]}${ranks[row]}`
}

export function getPieceSymbol(piece: ChessPiece): string {
  return PIECE_SYMBOLS[piece.type][piece.color]
}
