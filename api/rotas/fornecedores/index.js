const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor =
  require("../../Serializador").SerializadorFornecedor;

roteador.get("/", async (requisicao, resposta, proximo) => {
  try {
    const resultados = await TabelaFornecedor.listar();
    resposta.status(200);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type")
    );
    return resposta.send(serializador.serializar(resultados));
  } catch (error) {
    return proximo(error);
  }
});

roteador.post("/", async (requisicao, resposta, proximo) => {
  try {
    const dadosRecebidos = requisicao.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    await fornecedor.criar();
    resposta.status(201);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type")
    );
    return resposta.send(serializador.serializar(fornecedor));
  } catch (erro) {
    return proximo(erro);
  }
});

roteador.get("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id });
    await fornecedor.carregar();
    resposta.status(200);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type"),
      ["email", "dataCriacao", "dataAtualizacao", "versao"]
    );
    return resposta.send(serializador.serializar(fornecedor));
  } catch (erro) {
    return proximo(erro);
  }
});

roteador.put("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const dadosRecebidos = requisicao.body;
    const dados = Object.assign({}, dadosRecebidos, { id });
    const fornecedor = new Fornecedor(dados);
    await fornecedor.atualizar();
    resposta.status(204);
    return resposta.end();
  } catch (erro) {
    return proximo(erro);
  }
});

roteador.delete("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id });
    await fornecedor.carregar();
    await fornecedor.remover();
    resposta.status(204);
    return resposta.end();
  } catch (erro) {
    return proximo(erro);
  }
});

module.exports = roteador;
