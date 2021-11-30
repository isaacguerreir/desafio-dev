<script>

export default {
  data() {
    return {
        whatIsHappening: "Hello, Mama",
        file: null,
        reader: new FileReader(),
        headers: [
            { text: 'Tipo', value: 'type.nature' },,
            { text: 'Data', value: 'date' },
            { text: 'Valor', value: 'value' },
            { text: 'CPF', value: 'cpf' },
            { text: 'Cartão', value: 'card' },
            { text: 'Hora', value: 'hour' },
            { text: 'Dono', value: 'owner' },
            { text: 'Nome da Empresa', value: 'name' },
        ],
        information: null,
        total: 0
    }
  },
  mounted() {
    console.log("whatIsHappening", this.whatIsHappening)
  },
  methods: {
    async parseCNAB() {
        const file = await this.file.text()
        const lines = file.split("\n").filter((line) => line.length > 0)
        this.information = lines.map(line => this.lineToTransaction(line))
        this.total =  this.calculateTotal(lines.map(line => this.lineToTransaction(line)))
    },
    typeOfDocument(code) {
        const result = {
            description: null,
            nature: null
        }
        switch(code) {
        case '1':
            result.description = 'Débito'
            result.nature = 'Entrada'
            return result
        case '2':
            result.description = 'Boleto'
            result.nature = 'Saída'
            return result
        case '3':
            result.description = 'Financiamento'
            result.nature = 'Saída'
            return result
        case '4':
            result.description = 'Crédito'
            result.nature = 'Entrada'
            return result
        case '5':
            result.description = 'Recebimento Empréstimo'
            result.nature = 'Entrada'
            return result
        case '6':
            result.description = 'Vendas'
            result.nature = 'Entrada'
            return result
        case '7':
            result.description = 'Recebimento TED'
            result.nature = 'Entrada'
            return result
        case '8':
            result.description = 'Recebimento DOC'
            result.nature = 'Entrada'
            return result
        case '9':
            result.description = 'Aluguel'
            result.nature = 'Saída'
            return result
        default:
            return result
        }
    },
    lineToTransaction(line) {
        return {
            type: this.typeOfDocument(line[0]),
            date: this.formatDate(line.slice(1, 9)),
            value: parseInt(line.slice(9, 19)) / 100.0,
            cpf: line.slice(19, 30),
            card: line.slice(30, 42),
            hour: this.formatHour(line.slice(42, 48)),
            owner: line.slice(48, 62),
            name: line.slice(62, 81),
            money: this.formatMoney(parseInt(line.slice(9, 19)) / 100.0)
        }
    },
    calculateTotal(transactions) {
        let total = 0
        for (let transaction of transactions) {
            console.log("total", transaction)
            if (transaction.type.nature == 'Entrada') {
                total += transaction.value
            } else {
                total -= transaction.value
            }

        }

        if (total < 0) {
            return `- ${this.formatMoney(Math.abs(total))}`
        }

        return this.formatMoney(Math.abs(total))
    },
    formatHour(text) {
        return `${text.slice(0,2)}:${text.slice(2,4)}:${text.slice(4,6)}`
    },
    formatDate(text) {
        const year        = text.substring(0,4);
        const month       = text.substring(4,6);
        const day         = text.substring(6,8);

        const date        = new Date(year, month-1, day);
        return `${this.zeroApply(date.getDate())}/${this.zeroApply((date.getMonth() + 1))}/${this.zeroApply(date.getFullYear().toString().slice(2,4))}` 
    },
    zeroApply(number) {
        if (parseInt(number) < 10) {
            return "0" + number
        }
        return number
    },
    formatMoney(value) {
        return `R$${parseFloat(value).toFixed(2)}`
    }
  }
  
};
</script>

<template>
    <v-app>
        <v-container>
            <v-row align='center' justify='center'>
                <v-col cols=10>
                    <v-card>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="text-overline mb-4">
                                Importe
                                </div>
                                <v-list-item-title class="text-h5 mb-1">
                                CNAB
                                </v-list-item-title>
                                <v-list-item-subtitle>Importar dados das movimentações finanaceira de várias lojas</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-card-actions>
                            <v-file-input
                                accept=".txt"
                                label="Clique aqui pra importar arquivo CNAB"
                                v-model="file"
                            ></v-file-input>
                            <v-btn
                                outlined
                                rounded
                                text
                                @click="parseCNAB"
                            >
                                Importar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row align='center' justify='center'>
                <v-col cols=10 v-if="information">
                    <v-data-table
                        :headers="headers"
                        :items="information"
                        class="elevation-1"
                    ></v-data-table>
                </v-col >
            </v-row >
            <v-row class='my-8' align='center' justify='center'>
                <v-row cols=12 v-if="information" align='center' justify='end'>
                    <v-col cols="5" align='center'><span class="text-h5 mx-3">Saldo Total:</span> <span class="text-h2">{{ total }}</span></v-col>
                    <v-col cols=1></v-col>
                </v-row >
               
        
            </v-row>
        </v-container>
    </v-app>
  
</template>
