import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Relatorios() {
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/relatorios");

        if (!response.ok) {
          throw new Error(`Erro ao buscar os dados do relatório: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setRelatorio(data);
        } else {
          throw new Error("A resposta não é um JSON válido.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Erro: {error}</div>;
  }

  if (!relatorio || !relatorio.livros_mais_emprestados || !relatorio.categorias_mais_emprestadas) {
    return <div className="text-center text-red-500">Erro: Dados não encontrados</div>;
  }

  const categoriasChartData = {
    labels: relatorio.categorias_mais_emprestadas.map((categoria) => categoria.categoria),
    datasets: [
      {
        label: "Total de Empréstimos por Categoria",
        data: relatorio.categorias_mais_emprestadas.map((categoria) => categoria.total_emprestimos),
        backgroundColor: "#452985",
        borderColor: "#341f74",
        borderWidth: 1,
      },
    ],
  };

  const livrosChartData = {
    labels: relatorio.livros_mais_emprestados.map((livro) => livro.titulo),
    datasets: [
      {
        label: "Total de Empréstimos por Livro",
        data: relatorio.livros_mais_emprestados.map((livro) => livro.total_emprestimos),
        backgroundColor: "#341f74",
        borderColor: "#231564",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex-auto w-full m-0 bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]">
      <Navbar />
      <section className="flex flex-col justify-center w-[90vw] m-auto mb-0 text-black min-h-[92vh]">
        <h3 className="text-3xl font-bold p-2 py-5 text-center">Relatórios de Empréstimos</h3>

        {/* Livros mais emprestados */}
        
        <div className="flex flex-col w-5/6 m-auto items-center">

            <div className="mb-8">
                <h1 className="font-semibold">Livros mais emprestados:</h1>
            <ul className="list-disc pl-6 mb-4">
                {relatorio.livros_mais_emprestados.map((livro, index) => (
                <li key={index}>
                    {livro.titulo}: {livro.total_emprestimos}
                </li>
                ))}
            </ul>
            <Bar
                data={livrosChartData}
                options={{
                responsive: false,
                plugins: {
                    title: {
                    display: true,
                    text: "Livros Mais Emprestados",
                    },
                },
                }}
                width={400} // Ajuste a largura aqui
                height={300} // Ajuste a altura aqui
            />
            </div>

            {/* Categorias mais emprestadas */}
            <div className="mb-8">
                <h1 className="font-semibold">Categorias mais emprestadas:</h1>
            <ul className="list-disc pl-6 mb-4">
                {relatorio.categorias_mais_emprestadas.map((categoria, index) => (
                <li key={index}>
                    {categoria.categoria}: {categoria.total_emprestimos}
                </li>
                ))}
            </ul>
            <Bar
                data={categoriasChartData}
                options={{
                responsive: false,
                plugins: {
                    title: {
                    display: true,
                    text: "Categorias Mais Emprestadas",
                    },
                },
                }}
                width={400} // Ajuste a largura aqui
                height={300} // Ajuste a altura aqui
            />
            </div>

            {/* Porcentagens */}
            <div className="mb-8 text-center">
            <p>Porcentagem de livros danificados: {relatorio.porcentagem_livros_danificados}%</p>
            <p>Porcentagem de multas: {relatorio.porcentagem_multas}%</p>
            </div>


        </div>

      </section>
    </div>
  );
}

export default Relatorios;
