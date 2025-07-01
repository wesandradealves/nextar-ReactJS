// Teste simples da API de atualização de chamados
async function testUpdateChamado() {
  try {
    console.log('🔍 Testando atualização de chamado...');
    
    const response = await fetch('http://localhost:3001/api/chamados/2', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descricao: 'Teste de atualização via script - ' + new Date().toISOString(),
        observacoes: 'Observação de teste via script'
      })
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('✅ Response OK:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('📋 Dados retornados:', data);
      console.log('✅ Teste passou! Chamado atualizado com sucesso.');
    } else {
      const error = await response.json();
      console.error('❌ Erro:', error);
    }
  } catch (error) {
    console.error('💥 Erro no teste:', error);
  }
}

testUpdateChamado();
