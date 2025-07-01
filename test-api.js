const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testando API de chamados...');
    
    // 1. Buscar chamados existentes
    console.log('\n1. Buscando chamados existentes:');
    const chamados = await axios.get('http://localhost:3000/api/chamados');
    console.log(`✅ Encontrados ${chamados.data.length} chamados`);
    
    if (chamados.data.length > 0) {
      const primeiroId = chamados.data[0].id;
      console.log(`\n2. Testando atualização do chamado ${primeiroId}:`);
      
      // 2. Testar atualização
      const dadosAtualizacao = {
        descricao: 'Teste de atualização - ' + new Date().toISOString(),
        observacoes: 'Observação de teste'
      };
      
      console.log('Dados a enviar:', dadosAtualizacao);
      
      const resultado = await axios.put(`http://localhost:3000/api/chamados/${primeiroId}`, dadosAtualizacao);
      console.log('✅ Atualização bem-sucedida!');
      console.log('Resultado:', resultado.data);
      
      // 3. Verificar se foi atualizado
      console.log('\n3. Verificando se foi atualizado:');
      const chamadoAtualizado = await axios.get(`http://localhost:3000/api/chamados/${primeiroId}`);
      console.log('Chamado atualizado:', chamadoAtualizado.data);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testAPI();
