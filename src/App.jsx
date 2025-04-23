import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Github, Linkedin, Mail, ExternalLink, ArrowRight, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Animación de entrada suave para elementos
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Animación escalonada para listas de elementos
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  const { toast } = useToast();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContact = () => {
    setIsContactModalOpen(true);
  };

  const handleDownloadCV = () => {
    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = '/files/hoja_de_vida.pdf'; // Asegúrate de que el archivo esté en public/files/
    link.download = 'CV-Sebastian-Caballero.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "¡Descarga iniciada!",
      description: "Tu hoja de vida se está descargando.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Gracias por contactarme. Te responderé pronto.",
        });
        setIsContactModalOpen(false);
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const socialLinks = {
    github: "https://github.com/cbascaballero27",
    linkedin: "https://www.linkedin.com/in/sebastian-caballero-escobar-aa8403163/",
    email: "mailto:sebastiancaballero2000@gmail.com"
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Modal de Contacto */}
      {isContactModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-background/95 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-accent/20"
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-light bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                Contáctame
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-full hover:bg-accent/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre"
                  className="focus:ring-2 focus:ring-primary transition-all border-accent/20"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu@email.com"
                  className="focus:ring-2 focus:ring-primary transition-all border-accent/20"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="message" className="text-sm font-medium">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="¿En qué puedo ayudarte?"
                  className="min-h-[120px] focus:ring-2 focus:ring-primary transition-all border-accent/20"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Button 
                  type="submit" 
                  className="w-full hover:scale-[1.02] transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Enviar Mensaje
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Sección Hero - Presentación principal */}
      <header className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-2xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extralight mb-4 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Sebastian Caballero
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Desarrollador Front End
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button 
              onClick={handleContact} 
              variant="outline" 
              size="lg" 
              className="group border-primary/20 hover:border-primary/40"
            >
              Contáctame
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              onClick={handleDownloadCV}
              variant="outline" 
              size="lg" 
              className="group border-primary/20 hover:border-primary/40"
            >
              Descargar CV
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </header>

      {/* Sección About Me */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            className="text-2xl font-extralight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Sobre Mí
          </motion.h2>
          <motion.p 
            className="text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Desarrollador Frontend especializado en React y Angular, con experiencia en la creación de aplicaciones web modernas y escalables. 
            Me apasiona combinar diseño y funcionalidad para construir interfaces intuitivas que ofrezcan una excelente experiencia de usuario. 
            Siempre en busca de las mejores prácticas y tecnologías emergentes para ofrecer soluciones innovadoras.
          </motion.p>
        </motion.div>
      </section>

      {/* Sección de Proyectos */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-extralight mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Proyectos Seleccionados
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {projects.map((project, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-none hover:bg-accent/50 transition-colors border border-accent/20 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-light">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary" 
                          className="font-normal bg-accent/20 hover:bg-accent/30 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sección de Habilidades */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            className="text-2xl font-extralight mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Habilidades
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-none hover:bg-accent/50 transition-colors text-center p-6 border border-accent/20 rounded-xl">
                  <img  
                    alt={`${skill.name} icon`} 
                    className="w-12 h-12 mx-auto mb-4 rounded-lg object-contain"
                    src={skill.image}
                  />
                  <h3 className="text-sm font-light">{skill.name}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sección de Contacto */}
      <footer className="container mx-auto px-4 py-12 border-t border-accent/20">
        <div className="text-center max-w-xl mx-auto">
          <motion.h2 
            className="text-2xl font-extralight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Contacto
          </motion.h2>
          <motion.p 
            className="text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Disponible para proyectos y colaboraciones
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20"
              onClick={() => window.open(socialLinks.github, '_blank')}
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20"
              onClick={() => window.open(socialLinks.linkedin, '_blank')}
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20"
              onClick={() => window.open(socialLinks.email, '_blank')}
            >
              <Mail className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Datos de proyectos
const projects = [
  {
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con carrito de compras y pagos integrados",
    tags: ["React", "Node.js", "Stripe"]
  },
  {
    title: "Task Management App",
    description: "Aplicación de gestión de tareas con características colaborativas",
    tags: ["React", "Firebase", "Tailwind"]
  },
  {
    title: "Portfolio Website",
    description: "Sitio web de portafolio personal con animaciones suaves",
    tags: ["React", "Framer Motion", "Tailwind"]
  },
  {
    title: "Blog Platform",
    description: "Plataforma de blog con sistema de gestión de contenido",
    tags: ["React", "GraphQL", "MDX"]
  }
];

// Datos de habilidades con descripciones para las imágenes
const skills = [
  { 
    name: "React",
    description: "Modern React logo with atomic symbol design in blue",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"
  },
  { 
    name: "Angular",
    description: "Angular framework logo in red",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png"
  },
  { 
    name: "TypeScript",
    description: "TypeScript programming language logo in blue",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png"
  },
  { 
    name: "JavaScript",
    description: "JavaScript programming language logo in yellow",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"
  },
  { 
    name: "HTML5",
    description: "HTML5 logo and markup language",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png"
  },
  { 
    name: "CSS3",
    description: "CSS3 styling language logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png"
  },
  { 
    name: "Git",
    description: "Git version control system logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png"
  },
  { 
    name: "Tailwind CSS",
    description: "Tailwind CSS utility-first framework logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/tailwind/tailwind.png"
  }
];
