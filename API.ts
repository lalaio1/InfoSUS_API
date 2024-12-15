import axios, { AxiosInstance } from 'axios';
import https from 'https';
import express, { Request, Response } from 'express';

interface PersonalData {
    nome?: string;
    dataNascimento?: string;
    sexo?: string;
    nomeMae?: string;
    nomePai?: string;
    grauQualidade?: string;
    ativo?: boolean;
    obito?: boolean;
    partoGemelar?: boolean;
    vip?: boolean;
    racaCor?: string;
    telefone?: string;
    nacionalidade?: string;
    endereco?: string;
}

interface LoginResponse {
    accessToken?: string;
}

class CPFLookupService {
    private email: string;
    private senha: string;
    private httpClient: AxiosInstance;

    constructor(email: string, senha: string) {
        this.email = email;
        this.senha = senha;
        this.httpClient = axios.create({
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false // Equivalent to SSL_VERIFYPEER and SSL_VERIFYHOST false
            })
        });
    }

    private getLoginHeaders() {
        const credentials = `${this.email}:${this.senha}`;
        const credentialsBase64 = Buffer.from(credentials).toString('base64');

        return {
            'Host': 'servicos-cloud.saude.gov.br',
            'Connection': 'keep-alive',
            'Accept': 'application/json',
            'X-Authorization': `Basic ${credentialsBase64}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Origin': 'https://si-pni.saude.gov.br',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://si-pni.saude.gov.br/'
        };
    }

    private getPesquisaHeaders(accessToken: string) {
        return {
            'Host': 'servicos-cloud.saude.gov.br',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Origin': 'https://si-pni.saude.gov.br',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://si-pni.saude.gov.br/'
        };
    }

    private formatarInformacoes(dadosPessoais: any): PersonalData {
        return {
            nome: dadosPessoais.nome,
            dataNascimento: dadosPessoais.dataNascimento,
            sexo: dadosPessoais.sexo,
            nomeMae: dadosPessoais.nomeMae,
            nomePai: dadosPessoais.nomePai,
            grauQualidade: dadosPessoais.grauQualidade,
            ativo: dadosPessoais.ativo,
            obito: dadosPessoais.obito,
            partoGemelar: dadosPessoais.partoGemelar,
            vip: dadosPessoais.vip,
            racaCor: dadosPessoais.racaCor,
            telefone: dadosPessoais.telefone,
            nacionalidade: dadosPessoais.nacionalidade,
            endereco: dadosPessoais.endereco
        };
    }

    async processarCPF(cpf: string, maxRetries: number = 3, retryDelay: number = 5000): Promise<PersonalData | { error: string }> {
        const loginUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/autenticacao/tokenAcesso';
        const pesquisaBaseUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/cidadao/cpf/';

        for (let i = 0; i < maxRetries; i++) {
            try {
                // Login request
                const loginResponse = await this.httpClient.post<LoginResponse>(
                    loginUrl, 
                    {}, 
                    { headers: this.getLoginHeaders() }
                );

                if (!loginResponse.data.accessToken) {
                    return { error: 'Erro no login' };
                }

                const pesquisaUrl = `${pesquisaBaseUrl}${cpf}`;
                const pesquisaResponse = await this.httpClient.get(
                    pesquisaUrl,
                    { 
                        headers: this.getPesquisaHeaders(loginResponse.data.accessToken!) 
                    }
                );

                if (pesquisaResponse.data.records && pesquisaResponse.data.records.length > 0) {
                    return this.formatarInformacoes(pesquisaResponse.data.records[0]);
                }

                return { error: 'Erro na pesquisa' };

            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }

        return { error: 'Falha na requisição apos varias tentativas' };
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Mude para seu login do spni 
const EMAIL = 'SEU_EMAIL_AQUI';
const SENHA = 'SUA_SENHA_AQUI';

const cpfLookupService = new CPFLookupService(EMAIL, SENHA);

app.get('/cpf', async (req: Request, res: Response) => {
    const cpf = req.query.cpf as string;

    if (!cpf) {
        return res.status(400).json({ error: 'Por favor, forneça o CPF na URL como ?cpf=seu_cpf' });
    }

    try {
        const resultado = await cpfLookupService.processarCPF(cpf);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
