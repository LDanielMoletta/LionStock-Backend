export const Messages = {
  API_RUNNING: 'API funcionando corretamente.',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado.',
  INTERNAL_ERROR: 'Erro interno do servidor.',
  USER_CREATED: 'Usuário criado com sucesso.',
  USER_UPDATED: 'Usuário atualizado com sucesso.',
  USER_DELETED: 'Usuário removido com sucesso.',
  PRODUCT_CREATED: 'Produto criado com sucesso.',
  PRODUCT_UPDATED: 'Produto atualizado com sucesso.',
  PRODUCT_DELETED: 'Produto removido com sucesso.',
  CATEGORY_CREATED: 'Categoria criada com sucesso.',
  CATEGORY_UPDATED: 'Categoria atualizada com sucesso.',
  CATEGORY_DELETED: 'Categoria removida com sucesso.',
} as const;

export type MessageKey = keyof typeof Messages;