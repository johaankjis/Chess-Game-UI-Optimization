export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type PieceColor = "white" | "black"

export interface ChessPiece {
  type: PieceType
  color: PieceColor
}

export interface Position {
  row: number
  col: number
}

export interface Move {
  from: Position
  to: Position
  piece: ChessPiece
  captured?: ChessPiece
  timestamp: number
}

export type Board = (ChessPiece | null)[][]
