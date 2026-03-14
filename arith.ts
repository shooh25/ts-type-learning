import { parseArith, parse } from "npm:tiny-ts-parser";

// 言語で扱う型の種類を定義：Boolean（真偽値）またはNumber（数値）のいずれか
type Type =
  | { tag: "Boolean" }
  | { tag: "Number" };

// 言語の式（項）を定義：true/falseリテラル、if条件分岐、数値リテラル、加算式を表現
type Term =
  | { tag: "true" }
  | { tag: "false" }
  | { tag: "if"; cond: Term; thn: Term; els: Term }
  | { tag: "number"; n: number }
  | { tag: "add"; left: Term; right: Term };

// 式を受け取り、その型をチェックして返す関数。型ルールに違反したらエラーを投げる
const typecheck = (t: Term): Type => {
  switch (t.tag) {
    case "true":
      // 真偽値リテラルtrueはBoolean型を返す
      return { tag: "Boolean" };
    case "false":
      // 真偽値リテラルfalseはBoolean型を返す
      return { tag: "Boolean" };
    case "if": {
      // if式の型チェック：条件はBoolean型、then/elseは同じ型であることを確認
      const condTy = typecheck(t.cond);
      if (condTy.tag !== "Boolean") throw "Boolean型を入力してください";
      // thenとelseの型をチェック
      const thnTy = typecheck(t.thn);
      const elsTy = typecheck(t.els);
      if (thnTy.tag !== elsTy.tag) {
        throw "then節とelse節の型が異なります";
      }
      return thnTy;
    }
    case "number":
      // 数値リテラルはNumber型を返す
      return { tag: "Number" };
    case "add": {
      // 加算式の型チェック：左辺と右辺が両方Number型であることを確認
      const leftTy = typecheck(t.left);
      if (leftTy.tag !== "Number") throw "左辺は数値型である必要があります";
      // 右辺もNumber型であることを確認
      const rightTy = typecheck(t.right);
      if (rightTy.tag !== "Number") throw "右辺は数値型である必要があります";
      return { tag: "Number" };
    }
  }
}

console.log(typecheck(parseArith("1 + 1")));