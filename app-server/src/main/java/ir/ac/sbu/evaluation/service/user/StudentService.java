package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentSaveDto;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public StudentService(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            PersonalInfoRepository personalInfoRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<StudentDto> list() {
        return studentRepository.findAll().stream()
                .map(StudentDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto save(StudentSaveDto studentSaveDto) {
        if (userRepository.findByUsername(studentSaveDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username exists: ID = " + studentSaveDto.getUsername());
        }
        Faculty faculty = facultyRepository.findById(studentSaveDto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: ID = "
                        + studentSaveDto.getFacultyId()));

        Student student = studentSaveDto.toStudent();
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setFaculty(faculty);

        PersonalInfo savedInfo = personalInfoRepository.save(student.getPersonalInfo());
        student.setPersonalInfo(savedInfo);

        return StudentDto.from(studentRepository.save(student));
    }

    public StudentDto retrieve(long userId) {
        return StudentDto.from(studentRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: ID = " + userId)));
    }
}
