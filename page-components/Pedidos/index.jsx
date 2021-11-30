import { Container, Wrapper } from '@/components/Layout'
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
// import { Post as PostItem } from '@/components/Views';
// import Link from 'next/link';
import { usePedidosItensAvulsosPages } from '@/lib/pedidosItensAvulsos';
import { ItemPedido } from '@/components/ItemPedido'
import styles from './admin.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetcher } from '@/lib/fetch';
import toast from 'react-hot-toast';
import Textarea from '@/components/Input/Textarea';


export const Pedidos = () => {
    const pedido = {
        taxaEntrega: 0,
        valor: 0,
        folhas: [],
        ingredientes: [],
        frutas: [],
        proteinas: [],
        fibras: [],
        molhos: [],
        extras: []
    }
    const [spedido, setSpedido] = useState(pedido)
    const { data, size, setSize, isLoadingMore, isReachingEnd } = usePedidosItensAvulsosPages();
    const posts = data
        ? data.reduce((acc, val) => [...acc, ...val.posts], [])
        : [];
    // console.log(posts)
    var dados = {
        folhas: [],
        ingredientes: [],
        frutas: [],
        proteinas: [],
        fibras: [],
        molhos: [],
        extras: []
    }


    posts.map(e => {
        // console.log(e)

        if (e.ref == "Folhas") {
            dados.folhas.push(e)
        }
        if (e.ref == "Ingredientes") {
            dados.ingredientes.push(e)
        }
        if (e.ref == "Frutas") {
            dados.frutas.push(e)
        }
        if (e.ref == "Proteínas") {
            dados.proteinas.push(e)
        }
        if (e.ref == "Fibras") {
            dados.fibras.push(e)
        }
        if (e.ref == "Molhos") {
            dados.molhos.push(e)
        }
        if (e.ref == "Extras") {
            dados.extras.push(e)
        }
    })
    function vai(tipo, nome, valor) {

        // pedido.folhas.push(nome)
        if (tipo == 'folhas') {
            setSpedido((spedido) => ({
                // ...spedido, folhas: {...spedido.folhas, nome} //funciona sem substituir
                ...spedido, folhas: [...spedido.folhas, { nome: nome.nome }]
            }))
        }
        if (tipo == 'ingredientes') {
            setSpedido((spedido) => ({ ...spedido, ingredientes: [...spedido.ingredientes, { nome: nome.nome }] }))
        }
        if (tipo == 'frutas') {
            setSpedido((spedido) => ({ ...spedido, frutas: [...spedido.frutas, { nome: nome.nome }] }))
        }
        if (tipo == 'proteinas') {
            setSpedido((spedido) => ({ ...spedido, proteinas: [...spedido.proteinas, { nome: nome.nome }] }))
        }
        if (tipo == 'fibras') {
            setSpedido((spedido) => ({ ...spedido, fibras: [...spedido.fibras, { nome: nome.nome }] }))
        }
        if (tipo == 'molhos') {
            setSpedido((spedido) => ({ ...spedido, molhos: [...spedido.molhos, { nome: nome.nome, add: parseFloat(nome.add) }] }))
            if (valor) {
                // console.log(parseFloat(valor))
                setSpedido(spedido => ({ ...spedido, valor: spedido.valor + parseFloat(valor) }))
            }
        }
        if (tipo == 'extras') {
            setSpedido((spedido) => ({ ...spedido, extras: [...spedido.extras, { nome: nome.nome, add: parseFloat(nome.add) }] }))
            if (valor) {
                // console.log(parseFloat(valor))
                setSpedido(spedido => ({ ...spedido, valor: spedido.valor + parseFloat(valor) }))
            }
        }
    }
    function apaga(tipo, index, valor) {
        // console.log([tipo, index])
        if (tipo == 'folhas') {
            spedido.folhas.splice(index, 1)
            setSpedido(spedido)
        }
        if (tipo == 'ingredientes') {
            spedido.ingredientes.splice(index, 1)
            setSpedido(spedido)
        }
        if (tipo == 'frutas') {
            spedido.frutas.splice(index, 1)
            setSpedido(spedido)
        }
        if (tipo == 'proteinas') {
            spedido.proteinas.splice(index, 1)
            setSpedido(spedido)
        }
        if (tipo == 'fibras') {
            spedido.fibras.splice(index, 1)
            setSpedido(spedido)
        }
        if (tipo == 'molhos') {
            spedido.molhos.splice(index, 1)
            setSpedido(spedido)
            if (valor) {
                // console.log(parseFloat(valor))
                setSpedido(spedido => ({ ...spedido, valor: spedido.valor - parseFloat(valor) }))
            }
        }
        if (tipo == 'extras') {
            spedido.extras.splice(index, 1)
            setSpedido(spedido)
            if (valor) {
                // console.log(parseFloat(valor))
                setSpedido(spedido => ({ ...spedido, valor: spedido.valor - parseFloat(valor) }))
            }
        }
    }
    const formaPagamento = [
        { _id: "PIX", nome: "PIX" },
        { _id: "DINHEIRO", nome: "DINHEIRO" },
        { _id: "DÉBITO", nome: "DÉBITO" },
        { _id: "CRÉDITO", nome: "CRÉDITO" },
    ]
    const nomePedido = useRef()
    const telefonePedido = useRef()
    const enderecoPedido = useRef()
    const refPedido = useRef()
    const obsPedido = useRef()
    const formaPagamentoPedido = useRef()
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = useCallback(
        async (e) => {
            setIsLoading(true);
            e.preventDefault();
            setSpedido(spedido => ({
                ...spedido,
                nome: nomePedido.current.value,
                fone: telefonePedido.current.value,
                endereco: enderecoPedido.current.value,
                ref: refPedido.current.value,
                obs: obsPedido.current.value,
                formaPagamento: formaPagamentoPedido.current.value
            }))
            setTimeout(async () => {
                try {
                    console.log(spedido)

                    await fetcher('/api/pedidosAvulso', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(spedido),
                    });
                    toast.success('sucesso ao solicitar seu pedido');
                    // nomeGru.current.value = '';
                    // descricaoGru.current.value = '';
                    // refresh post lists
                    // mutate();
                    nomePedido.current.value = ''
                } catch (error) {
                    toast.error(error.message)
                } finally {
                    setIsLoading(false);
                }
            }, 5000)

        }
    )
    // console.log(spedido)
    const testefolha = spedido.folhas.length
    const testeingredientes = spedido.ingredientes.length
    const testefrutas = spedido.frutas.length
    const testeproteinas = spedido.proteinas.length
    const testefibras = spedido.fibras.length
    const testemolhos = spedido.molhos.length
    const testextras = spedido.extras.length

    const [temPedido, setTemPedido] = useState(false)
    return (
        <Wrapper>
            
            Folhas
            {spedido.folhas.map((e, index) => {
                // {console.log(index)}
                return (
                    <button onClick={() => { apaga("folhas", index) }}>{e.nome}</button>
                )
            })}
            {dados.folhas.map((e) => {
                if (testefolha < 2) {
                    if (spedido.folhas[0]) {
                        if (spedido.folhas[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.folhas[1]) {
                        if (spedido.folhas[1].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p onClick={(v) => { v.preventDefault(), vai('folhas', e) }}>
                        <ItemPedido post={e} className={styles.wrapper} /></p></>)
                } else {
                    if (spedido.folhas[0]) {
                        if (spedido.folhas[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.folhas[1]) {
                        if (spedido.folhas[1].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            Ingredientes
            {spedido.ingredientes.map((e, index) => {
                return (
                    <button onClick={() => { apaga("ingredientes", index) }}>{e.nome}</button>
                )
            })}
            {dados.ingredientes.map((e) => {
                if (testeingredientes < 4) {
                    if (spedido.ingredientes[0]) {
                        if (spedido.ingredientes[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[1]) {
                        if (spedido.ingredientes[1].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[2]) {
                        if (spedido.ingredientes[2].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[3]) {
                        if (spedido.ingredientes[3].nome == e.nome) {
                            return
                        }
                    }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('ingredientes', e) }}>
                                <ItemPedido post={e} className={styles.wrapper} />
                            </p>
                        </>
                    )
                } else {
                    if (spedido.ingredientes[0]) {
                        if (spedido.ingredientes[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[1]) {
                        if (spedido.ingredientes[1].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[2]) {
                        if (spedido.ingredientes[2].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.ingredientes[3]) {
                        if (spedido.ingredientes[3].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            frutas
            {spedido.frutas.map((e, index) => {
                return (
                    <button onClick={() => { apaga("frutas", index) }}>{e.nome}</button>
                )
            })}
            {dados.frutas.map((e) => {
                if (testefrutas < 1) {
                    if (spedido.frutas[0]) {
                        if (spedido.frutas[0].nome == e.nome) {
                            return
                        }
                    }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('frutas', e) }}>
                                <ItemPedido post={e} className={styles.wrapper} />
                            </p>
                        </>
                    )
                } else {
                    if (spedido.frutas[0]) {
                        if (spedido.frutas[0].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            Proteínas
            {spedido.proteinas.map((e, index) => {
                return (
                    <button onClick={() => { apaga("proteinas", index) }}>{e.nome}</button>
                )
            })}
            {dados.proteinas.map((e) => {
                if (testeproteinas < 2) {
                    if (spedido.proteinas[0]) {
                        if (spedido.proteinas[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.proteinas[1]) {
                        if (spedido.proteinas[1].nome == e.nome) {
                            return
                        }
                    }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('proteinas', e) }}>
                                <ItemPedido post={e} className={styles.wrapper} />
                            </p>
                        </>
                    )
                } else {
                    if (spedido.proteinas[0]) {
                        if (spedido.proteinas[0].nome == e.nome) {
                            return
                        }
                    }
                    if (spedido.proteinas[1]) {
                        if (spedido.proteinas[1].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            Fibras
            {spedido.fibras.map((e, index) => {
                return (
                    <button onClick={() => { apaga("fibras", index) }}>{e.nome}</button>
                )
            })}
            {dados.fibras.map((e) => {
                if (testefibras < 2) {
                    if (spedido.fibras[0]) {
                        if (spedido.fibras[0].nome == e.nome) {
                            return
                        }
                    } if (spedido.fibras[1]) {
                        if (spedido.fibras[1].nome == e.nome) {
                            return
                        }
                    }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('fibras', e) }}>
                                <ItemPedido post={e} className={styles.wrapper} />
                            </p>
                        </>
                    )
                } else {
                    if (spedido.fibras[0]) {
                        if (spedido.fibras[0].nome == e.nome) {
                            return
                        }
                    } if (spedido.fibras[1]) {
                        if (spedido.fibras[1].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            Molhos
            {spedido.molhos.map((e, index) => {
                // console.log(e)
                return (
                    <button onClick={() => { apaga("molhos", index, e.add) }} >{e.nome}</button>
                )
            })}
            {dados.molhos.map((e) => {
                // console.log(e)
                if (testemolhos < 1) {
                    // if (spedido.molhos[0]) {
                    //     if (spedido.molhos[0].nome == e.nome) {
                    //         return
                    //     }
                    // }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('molhos', e) }}>
                                <ItemPedido post={e} className={styles.wrapper} />
                            </p>
                        </>
                    )
                } else {

                    return (<>

                        <p onClick={(v) => { v.preventDefault(), vai('molhos', e, e.add) }}>
                            <ItemPedido post={e} className={styles.wrapper} valor={true} />
                        </p>
                    </>)
                }
            })}
            Extras
            {spedido.extras.map((e, index) => {
                return (
                    <button onClick={() => { apaga("extras", index, e.add) }}>{e.nome}</button>
                )
            })}
            {dados.extras.map((e) => {
                if (testextras < 8) {
                    if (spedido.extras[0]) {
                        if (spedido.extras[0].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[1]) {
                        if (spedido.extras[1].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[2]) {
                        if (spedido.extras[2].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[3]) {
                        if (spedido.extras[3].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[4]) {
                        if (spedido.extras[4].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[5]) {
                        if (spedido.extras[5].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[6]) {
                        if (spedido.extras[6].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[7]) {
                        if (spedido.extras[7].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[8]) {
                        if (spedido.extras[8].nome == e.nome) {
                            return
                        }
                    }
                    return (
                        <>
                            <p onClick={(v) => { v.preventDefault(), vai('extras', e, e.add) }}>
                                <ItemPedido post={e} className={styles.wrapper} valor={true} />
                            </p>
                        </>
                    )
                } else {
                    if (spedido.extras[0]) {
                        if (spedido.extras[0].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[1]) {
                        if (spedido.extras[1].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[2]) {
                        if (spedido.extras[2].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[3]) {
                        if (spedido.extras[3].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[4]) {
                        if (spedido.extras[4].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[5]) {
                        if (spedido.extras[5].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[6]) {
                        if (spedido.extras[6].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[7]) {
                        if (spedido.extras[7].nome == e.nome) {
                            return
                        }
                    } if (spedido.extras[8]) {
                        if (spedido.extras[8].nome == e.nome) {
                            return
                        }
                    }
                    return (<><p><ItemPedido post={e} className={styles.wrapper} /></p></>)
                }
            })}
            <form onSubmit={onSubmit}>
                <Container className={styles.column}>
                    <h1>R$ {spedido.valor} + <small>taxa de entrega</small></h1>
                    <Input label="nome" ref={nomePedido} required />
                    <Input label="teleforne" ref={telefonePedido} required />
                    <Textarea label="endereço" ref={enderecoPedido} required />
                    <Textarea label="ponto de referência" ref={refPedido} />
                    <Textarea label="observações pertinentes" ref={obsPedido} />
                    <Select required label="Forma de pagamento" ref={formaPagamentoPedido} data={formaPagamento} firstOption />
                    <Button type="success" loading={isLoading} >
                        solicitar Pedido
                    </Button>

                </Container>
            </form>

        </Wrapper >
    )


}
